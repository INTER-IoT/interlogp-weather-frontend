<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h4 class="card-title">Port Stations</h4>
              <p class="card-category">Real Time Environmental Stations</p>
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
              <tr v-for="(item, index) in values" :key="index">
                <slot :row="item">
                  <td v-for="(column, index) in columns" :key="index">{{item[column]}}</td>
                </slot>
                <!--
                <td></td>
                <td><button class="btn btn-sm btn-primary btn-fill" @click="copyRule(item.raw)"><font-awesome-icon icon="copy"></font-awesome-icon></button></td>
                <td></td>
                <td><button class="btn btn-sm btn-primary btn-fill" @click="copyRule(item.raw)"><font-awesome-icon icon="copy"></font-awesome-icon></button></td>
                -->
                <td>
                  <button class="btn btn-sm btn-primary btn-fill" @click="copyRule(item)"><font-awesome-icon icon="copy"></font-awesome-icon></button>
                  <button class="btn btn-sm btn-danger btn-fill" @click="deleteRule(item)"><font-awesome-icon icon="trash-alt"></font-awesome-icon></button>
                  <switches v-model="item.enabled" theme="bootstrap" color="primary" @input="switchRule(item)" :emit-on-mount=false></switches>
                  
                </td>
              </tr>
              </tbody>
            </table>
              <rule-form @add="ruleAdded"></rule-form>
            </div>
            <div class="card-body" v-else>
              <span style="color: #7b7b7b">Please select station in the map</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Switches from 'vue-switches';
  import Card from 'src/components/UIComponents/Cards/Card.vue';
  import RuleForm from './Rules/RuleForm.vue';

  export default {
    components: {
      Card,
      RuleForm,
      Switches,
    },
    props: {
      port: Object,
    },
    data() {
      return {
        columns: ['id', 'type', 'ports', 'stations', 'rule'],
        values: [
        ],
      };
    },
    methods: {
      ruleAdded(data) {
        const rule = data;
        rule.ports = rule.ports[0] !== '*' ? rule.ports : [];
        rule.stations = rule.stations[0] !== '*' ? rule.stations : [];
        if (rule.operation.indexOf('<') >= 0) rule.comparison = -1;
        else if (rule.operation.indexOf('>') >= 0) rule.comparison = 1;
        else rule.comparison = 0;
        rule.inclusive = rule.operation.indexOf('=') >= 0;
        this.values.push({
          id: this.values.length + 1,
          type: rule.type,
          ports: rule.ports.join(', '),
          stations: rule.stations.join(', '),
          rule: `${rule.attribute} ${rule.operation} ${rule.value}`,
          raw: rule,
        });
        delete rule.operation;
      },
      copyRule(item) {
        console.log('Copy');
        console.log(item);
      },
      switchRule(item) {
        console.log('Switch');
        console.log(item);
      },
      deleteRule(item) {
        console.log('Delete');
        console.log(item);
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
