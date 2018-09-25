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
              <div class="form-row">
                <div class="form-group col-md-2">
                  <label>Type</label>
                  <select class="form-control form-control-sm">
                    <option value="" selected disabled></option>
                    <option>weather</option>
                  </select>
                </div>
                <div class="form-group col-md-1">
                  <label>Ports</label>
                  <input class="form-control form-control-sm" type="text" placeholder="1">
                </div>
                <div class="form-group col-md-2">
                  <label>Stations</label>
                  <input class="form-control form-control-sm" type="text" placeholder="*">
                </div>
                <div class="form-group col-md-3">
                  <label>Attribute</label>
                  <select class="form-control form-control-sm">
                    <option value="" selected disabled></option>
                    <option>averageTemperature</option>
                  </select>
                </div>
                <div class="form-group col-md-1">
                  <label>Comp</label>
                  <select class="form-control form-control-sm">
                    <option value="" selected disabled></option>
                    <option>=</option>
                  </select>
                </div>
                <div class="form-group col-md-2">
                  <label>Value</label>
                  <input class="form-control form-control-sm" type="number" placeholder="0" step=any >
                </div>
                <div class="form-group col-md-1">
                  <label>&nbsp;</label>
                  <input class="btn btn-primary btn-fill btn-sm" type="button" value="ADD" style="width: 100%">
                </div>
              </div>
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
  import Card from 'src/components/UIComponents/Cards/Card.vue';
  import gql from 'graphql-tag';

  export default {
    components: {
      Card,
    },
    props: {
      port: Object,
    },
    data() {
      return {
        definitions: {
          types: ['', 'weather', 'emission', 'sound'],
          attributes: {
            weather: ['', 'averageTermperature', 'humidity'],
            emission: ['', 'co', 'no', 'no2'],
            sound: ['', 'minLevel', 'maxLevel'],
          },
          operations: ['', '<', '<=', '=', '=>', '>'],
        },
      };
    },
  };
</script>
<style>

</style>
