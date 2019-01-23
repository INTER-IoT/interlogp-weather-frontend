export default {
  install: (Vue) => {
    Vue.prototype.$alerts = {
      get number(){
        window.alerts = 5;
        return window.alerts;
      },
    },
    Vue.mixin({
      data: function(){
        return {
          get alertNumber() {
            window.alerts = 3;
            return window.alerts;
          },
        }
      },
    })
  },
};
