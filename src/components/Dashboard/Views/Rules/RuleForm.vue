<template>
  <div class="form-row">
    <div class="form-group col-md-2">
      <label>Type</label>
      <select class="form-control form-control-sm fix-fc" v-model="selection.type" @change="resetAttributeSelection">
        <option value="" selected disabled></option>
        <option v-for="(item, index) in definitions.types" :key="index" :value="item">{{item}}</option>
      </select>
    </div>
    <div class="form-group col-md-1">
      <label>Ports</label>
      <input class="form-control form-control-sm fix-fc" type="text" placeholder="1" v-model="selection.ports">
    </div>
    <div class="form-group col-md-2">
      <label>Stations</label>
      <input class="form-control form-control-sm fix-fc" type="text" placeholder="*" v-model="selection.stations">
    </div>
    <div class="form-group col-md-3">
      <label>Attribute</label>
      <select class="form-control form-control-sm fix-fc" v-model="selection.attribute">
        <option value="" selected disabled></option>
        <option v-for="(item, index) in definitions.attributes[selection.type]" :key="index" :value="item">{{item}}</option>
      </select>
    </div>
    <div class="form-group col-md-1">
      <label>Comp</label>
      <select class="form-control form-control-sm fix-fc" v-model="selection.operation">
        <option value="" selected disabled></option>
        <option v-for="(item, index) in definitions.operations" :key="index" :value="item">{{item}}</option>
      </select>
    </div>
    <div class="form-group col-md-2">
      <label>Value</label>
      <input class="form-control form-control-sm fix-fc" type="number" placeholder="0" step=any v-model="selection.value">
    </div>
    <div class="form-group col-md-1">
      <label>&nbsp;</label>
      <input class="btn btn-primary btn-fill btn-sm" type="button" value="ADD" style="width: 100%" :disabled="isValid === false" @click="onAdd">
    </div>
  </div>
</template>
<script>
  export default {
    name: 'rule-form',
    data() {
      return {
        definitions: {
          types: ['weather', 'emission', 'sound'],
          attributes: {
            weather: ['averageTermperature', 'humidity'],
            emission: ['co', 'no', 'no2'],
            sound: ['minLevel', 'maxLevel'],
          },
          operations: ['<', '<=', '=', '>=', '>'],
        },
        selection: {
          type: null,
          ports: null,
          stations: null,
          attribute: null,
          operation: null,
          value: null,
        },
      };
    },
    computed: {
      isValid() {
        return (
          this.selection.type
          && this.selection.attribute
          && this.selection.operation
          && this.selection.value
          && this.selection.value !== ''
          && this.parsedPorts.length > 0
          && this.parsedStations.length > 0
        ) || false;
      },
      parsedPorts() {
        return this.parseCSV(this.selection.ports);
      },
      parsedStations() {
        return this.parseCSV(this.selection.stations);
      },
      data() {

      },
    },
    methods: {
      resetAttributeSelection() {
        this.selection.attribute = null;
      },
      parseCSV(input) {
        if (!input) return [];
        const items = input.split(',').map(item => item.trim());
        let valid = items.reduce((v, p) => v && p !== '' && (p === '*' || (Number.isInteger(+p) && Number(+p) >= 0)), true);
        if (items.indexOf('*') >= 0 && items.length > 1) valid = false;
        if (!valid) return [];
        return items.map(i => (i === '*' ? i : +i));
      },
      onAdd() {
        const data = Object.assign({}, this.selection);
        data.ports = this.parsedPorts.slice();
        data.stations = this.parsedStations.slice();
        data.value = +data.value;
        this.$emit('add', data);
      },
      load(data) {
        this.selection.type = data.type;
        this.selection.ports = data.port.length === 0 ? '*' : data.port.join(', ');
        this.selection.stations = data.station.length === 0 ? '*' : data.station.join(', ');
        this.selection.attribute = data.attribute;
        if(data.comparison === -1) {
          this.selection.operation = data.inclusive ? '<=' : '<';
        } else if(data.comparison === 1) {
          this.selection.operation = data.inclusive ? '>=' : '>';
        } else {
          this.selection.operation = '=';
        }
        this.selection.value = data.value;
      },
    },
  };
</script>
<style>
  /* For some reason form-control-sm is not working, this fixes it */
  .fix-fc {
    height: calc(1.8125rem + 2px) !important;
    padding: 0.25rem 0.5rem !important;
    font-size: 0.875rem !important;
    line-height: 1.5 !important;
    border-radius: 0.2rem !important;
  }
</style>
