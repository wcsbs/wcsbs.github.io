<template>
  <div>
    <b-form @submit="onSubmit" @reset="onReset">
      <h4>Run Admin Functions</h4>
      <TextReader @load="fields = $event" />
      <b-form-textarea
        :value="JSON.stringify(fields, null, 4)"
        placeholder="CSV fields will appear here"
        rows="2"
        max-rows="10"
        readonly
      ></b-form-textarea>
      <VueCsvImport
        v-model="parseCsv"
        :map-fields="fields"
        :autoMatchFields="true"
      ></VueCsvImport>
      <b-form-textarea
        :value="JSON.stringify(parseCsv, null, 4)"
        placeholder="JSON converted from CSV file content will appear here"
        rows="8"
        max-rows="20"
        readonly
      ></b-form-textarea>
      <b-form-textarea
        v-model="params"
        placeholder="Enter parameters"
        rows="8"
        max-rows="20"
      ></b-form-textarea>
      <b-input-group prepend="Name：" class="mt-3">
        <b-form-input v-model="name" placeholder="Enter function name" trim />
        <b-input-group-append>
          <b-button type="reset" variant="warning">
            <b-icon icon="x-circle"></b-icon>
          </b-button>
          <b-button type="submit" variant="success">
            <b-icon icon="check-circle"></b-icon>
          </b-button>
        </b-input-group-append>
      </b-input-group>
    </b-form>
    <div class="multiline">Result: {{ result }}</div>
  </div>
</template>

<script>
import Parse from "parse";
import TextReader from "../components/TextReader";
import { VueCsvImport } from "vue-csv-import";

export default {
  name: "AdminDashboard",
  components: {
    TextReader,
    VueCsvImport
  },
  data: function() {
    return {
      text: "",
      name: "",
      params: "",
      result: "",
      parseCsv: undefined,
      fieldsStr: "",
      fields: [
        "组别",
        "组员",
        "24FEB-01MAR",
        "FEB2020TOTAL",
        "2-8MAR",
        "9-15MAR",
        "16-22MAR",
        "23-29MAR",
        "MAR2020 TOTAL",
        "30MAR-5APR",
        "6-12APR",
        "13-19APR",
        "20-26APR",
        "APR2020 TOTAL",
        "27APR-3MAY",
        "4-10MAY",
        "11-17MAY",
        "18-24MAY",
        "25-31MAY",
        "MAY2020 TOTAL",
        "1-7JUN",
        "8-14JUN",
        "15-21JUN",
        "22-28JUN",
        "JUN2020 TOTAL",
        "29JUN-5JUL",
        "6-12JUL",
        "13-19JUL",
        "20-26JUL",
        "JUL2020 TOTAL",
        "27JUL-2AUG",
        "3-9AUG",
        "10-16AUG",
        "17-23AUG",
        "24-30AUG",
        "AUG2020 TOTAL",
        "31AUG-6SEP",
        "7-13SEP",
        "14-20SEP",
        "21-27SEP",
        "SEP2020 TOTAL",
        "28SEP-4OCT",
        "5-11OCT",
        "12-18OCT",
        "19-25OCT",
        "26OCT-1NOV",
        "OCT2020 TOTAL"
      ]
    };
  },
  methods: {
    onReset(evt) {
      evt.preventDefault();
      this.text = "";
      this.name = "";
      this.params = "";
      this.result = "";
    },
    onSubmit(evt) {
      evt.preventDefault();
      const options = {
        okText: "Confirm",
        cancelText: "Cancel",
        loader: true // default: false - when set to true, the proceed button shows a loader when clicked; and a dialog object will be passed to the then() callback
      };
      const params = JSON.parse(this.params);
      if (!this.name || this.name.length == 0) {
        this.name = params.functionName;
      }

      const message = {
        title: "Run Admin Function",
        body: `Confirm to run function ${this.name}？`
      };

      params.csv = this.parseCsv;
      this.text = JSON.stringify(params);

      const thisComponent = this;

      this.$dialog
        .confirm(message, options)
        .then(function(dialog) {
          Parse.Cloud.run(thisComponent.name, params)
            .then(result => {
              thisComponent.result = JSON.stringify(result, null, 4);
              dialog.close();
            })
            .catch(e => {
              thisComponent.result = JSON.stringify(e, null, 4);
              dialog.close();
            });
        })
        .catch(e => {
          console.log(`error: ${e}`);
        });
    }
  }
};
</script>

<style>
.multiline {
  white-space: pre-wrap;
}
</style>
