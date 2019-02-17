<template>
  <div class="card">
    <div class="card-header">
      <h4 class="card-title">Rules</h4>
      <p class="card-category">Current rule definitions for all ports</p>
    </div>
    <div class="card-body" v-if="true">
      <table class="table table-sm table-fix-sm">
      <thead>
        <tr>
          <slot name="columns">
            <th v-for="(column, index) in columns" :key="index" >{{column}}</th>
          </slot>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in rules" :key="index">
        <slot :row="item">
          <td v-for="(column, index) in columns" :key="index">{{item[column]}}</td>
        </slot>
        <td style="display:flex; justify-content:space-around">
          <button class="btn btn-sm btn-primary btn-fill" @click="copyRule(item)"><font-awesome-icon icon="copy"></font-awesome-icon></button>
          <button class="btn btn-sm btn-danger btn-fill" @click="deleteRule(item)"><font-awesome-icon icon="trash-alt"></font-awesome-icon></button>
          <switch-button v-model="item.enabled" :color="item.enabled?'green':'gray'" @toggle="switchRule(item)"/>
        </td>
      </tr>
      </tbody>
    </table>
      <rule-form ref="ruleForm" @add="addRule"></rule-form>
    </div>
    <div class="card-body" v-else>
      <span style="color: #7b7b7b">Please select station in the map</span>
    </div>
  </div>
</template>
<script>
  //import Switches from 'vue-switches';
  import SwitchButton from 'src/components/UIComponents/Inputs/Switch.vue'
  import Card from 'src/components/UIComponents/Cards/Card.vue';
  import RuleForm from './RuleForm.vue';
  import {
    RULES_QUERY,
    ADD_RULE_MUTATION,
    DELETE_RULE_MUTATION,
    SET_STATE_RULE_MUTATION,
  } from './Rules.gql'
  export default {
    name: 'rules-card',
    components: {
      Card,
      RuleForm,
      SwitchButton,
    },
    props: {
      port: Object,
    },
    data() {
      return {
        columns: ['id', 'type', 'ports', 'stations', 'rule'],
      };
    },
    apollo: {
      rules: {
        query: RULES_QUERY,
        update(data) {
          return data.rules.map(rule => this.ruleItem(rule));
        },
      },
    },
    methods: {
      addRule(data) {
        const rule = data;
        rule.port = rule.ports[0] !== '*' ? rule.ports : [];
        delete rule.ports;
        rule.station = rule.stations[0] !== '*' ? rule.stations : [];
        delete rule.stations;
        if (rule.operation.indexOf('<') >= 0) rule.comparison = -1;
        else if (rule.operation.indexOf('>') >= 0) rule.comparison = 1;
        else rule.comparison = 0;
        rule.inclusive = rule.operation.indexOf('=') >= 0;
        delete rule.operation;
        this.$apollo.mutate({
          mutation: ADD_RULE_MUTATION,
          variables: {
            rule,
          },
          update: (store, {data: { createRule } }) => {
            const data = store.readQuery({query: RULES_QUERY});
            data.rules.push(createRule);
            store.writeQuery({query: RULES_QUERY, data});
          },
        });
      },
      copyRule(item) {
        this.$refs.ruleForm.load(item.raw);
      },
      switchRule(item) {
        this.$apollo.mutate({
          mutation: SET_STATE_RULE_MUTATION,
          variables: {
            ruleid: item.id,
            state: item.enabled,
          },
          update: (store, {data: { setRuleState } }) => {
            const data = store.readQuery({query: RULES_QUERY});
            const idx = data.rules.findIndex(item => item.id === setRuleState.id);
            data.rules[idx] = setRuleState;
            store.writeQuery({query: RULES_QUERY, data});
          },
        });
      },
      deleteRule(item) {
        this.$apollo.mutate({
          mutation: DELETE_RULE_MUTATION,
          variables: {
            ruleid: item.id,
          },
          update: (store, {data: { deleteRule } }) => {
            const data = store.readQuery({query: RULES_QUERY});
            const idx = data.rules.findIndex(item => item.id === deleteRule.id);
            data.rules.splice(idx, 1);
            store.writeQuery({query: RULES_QUERY, data});
          },
        });
      },
      ruleItem(rule) {
        let operation;
        if(rule.comparison === -1) {
          operation = rule.inclusive ? '<=' : '<';
        } else if(rule.comparison === 1) {
          operation = rule.inclusive ? '>=' : '>';
        } else {
          operation = '=';
        }
        return {
          id: rule.id,
          type: rule.type,
          ports: rule.port.length === 0 ? '*' : rule.port.join(', '),
          stations: rule.station.length === 0 ? '*' : rule.station.join(', '),
          rule: `${rule.attribute} ${operation} ${rule.value}`,
          enabled: rule.enabled,
          raw: rule,
        };
      },
    },
  };
</script>
<style>
  .table-fix-sm th {
    padding: 0.3rem !important;
    line-height: 1.5 !important;
  }
  .table-fix-sm td {
    padding: 0.3rem !important;
    font-size: 0.875rem !important;
    line-height: 1.5 !important;
  }
  .table-fix-sm tbody tr:nth-of-type(odd) {
    background-color: rgba(0,0,0,.05) !important;
  }
</style>
