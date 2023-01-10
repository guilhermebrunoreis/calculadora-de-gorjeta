<template>
  <div class="container">
    <b-row class="d-flex justify-content-center pt-5 pb-2">
      <h2>
        <div>
          <h2>Le/Tip</h2>
        </div>
      </h2>
    </b-row>

    <div class="row">
      <b-col xl="5" md="12" sm="12" id="left-block"
        class="bloco-esq container justify-content-center align-items-center">
        <form @submit.prevent="changeBlock">
          <div class="form-group">
            <select class="form-control" v-model.number="currency" id="currency">
              <option>USD</option>
              <option>EUR</option>
            </select>
          </div>

          <b-form-group>
            <b-row class="d-flex flex-column">
              <b-col sm="3">
                <label for="total">Valor: </label>
              </b-col>

              <b-col sm="9">
                <vue-numeric class="inputValorTotal" value="" :currency="currencySymbol"
                  :placeholder="currencySymbol + ' 0.00'" :currency-symbol-position="currencySymboPosition"
                  precision="2" decimal-separator="," separator="." v-model="billTotal"></vue-numeric>

              </b-col>
            </b-row>
          </b-form-group>

          <b-form-group>
            <b-row class="d-flex flex-column">
              <b-col class="d-flex justify-content-center">
                <label class="d-flex flex-column text-center" for="tip">Gorjeta: <span style="font-size:2em;">{{
                  tipPercentage
                }}% </span></label>
              </b-col>

              <b-col class="d-flex align-items-center">
                10<b-form-input id="tip" :disabled="billTotal == ''" v-model.number="tipPercentage" type="range"
                  min="10" max="20"></b-form-input>20
              </b-col>
            </b-row>
          </b-form-group>

          <b-form-group>
            <b-row class="d-flex flex-column">
              <b-col class="d-flex justify-content-center">
                <label class="d-flex flex-column text-center" for="tip">Pessoas: <span style="font-size:2em;">{{
                  numberOfPeople
                }}</span> </label>
              </b-col>

              <b-col class="d-flex align-items-center">
                2<b-form-input id="tip" :disabled="billTotal == ''" v-model.number="numberOfPeople" type="range" min="2"
                  max="16"></b-form-input>16
              </b-col>
            </b-row>
          </b-form-group>

          <button type="button" :disabled="billTotal == ''" @click="changeBlock()" style="display:none"
            class="mb-next-page"> > </button>

        </form>
      </b-col>

      <b-col xl="5" md="12" sm="12" id="right-block"
        class="bloco-dir container flex-column align-content-center justify-content-center">
        <div>
          Conta:
          <div class="currency-block">
            <span v-if="this.currency == 'USD'">
              {{ currencySymbol }}
            </span>

            {{ formatPrice(billTotal) }}

            <span v-if="this.currency == 'EUR'">
              {{ currencySymbol }}
            </span>
          </div>
        </div>

        <div>
          Gorjeta:
          <div class="currency-block">
            <span v-if="this.currency == 'USD'">
              {{ currencySymbol }}
            </span>

            {{ formatPrice(tipTotal) }}

            <span v-if="this.currency == 'EUR'">
              {{ currencySymbol }}
            </span>
          </div>
        </div>

        <div>
          Total:
          <div class="currency-block">
            <span v-if="this.currency == 'USD'">
              {{ currencySymbol }}
            </span>

            {{ formatPrice(total) }}

            <span v-if="this.currency == 'EUR'">
              {{ currencySymbol }}
            </span>
          </div>
        </div>

        <div>
          por Pessoa:
          <div class="currency-block">
            <span v-if="this.currency == 'USD'">
              {{ currencySymbol }}
            </span>
            {{ formatPrice(amountPerPerson) }}
            <span v-if="this.currency == 'EUR'">
              {{ currencySymbol }}
            </span>
          </div>
        </div>

        <div>
          em Reais:
          <div class="currency-block">
            R$ {{ formatPrice(totalBRL) }}
          </div>
        </div>

        <button type="button" @click="mainBlock()" style="display:none" class="mb-main-page">&lt;</button>
      </b-col>
    </div>
  </div>
</template>

<script>

import axios from 'axios'
import { formatPrice } from "@/utils/formatNumber";
import VueNumeric from 'vue-numeric'

export default {
  data() {
    return {
      billTotal: '',
      tipPercentage: 10,
      numberOfPeople: 2,
      currency: 'USD',
      currencySymbol: '$',
      currentStatus: 0,
      totalReais: 0,
      currencySymboPosition: "prefix",

    }
  },

  components: {
    VueNumeric
  },

  computed: {

    tipTotal() {
      return this.billTotal * (this.tipPercentage / 100);
    },
    total() {
      return this.billTotal + this.tipTotal;
    },
    amountPerPerson() {
      return this.total / this.numberOfPeople;
    },
    totalBRL() {
      return this.amountPerPerson * this.currentStatus;
    }
  },

  created() {
    // Inicia o calculo com o tipo inical (USD)
    this.initCalc();
  },


  methods: {
    initCalc() {
      this.$axios.get(`latest?apikey=YhJUQJgs2zKo9pU6LWAvjoUPFRkj80MzVJyd4QsW&currencies=BRL&base_currency=${this.currency}`,
      )
        .then(response => {
          this.currentStatus = response.data.data.BRL.value;
          this.tipTotal = this.tipTotal * this.currentStatus;
          this.total = this.total * this.currentStatus;
          this.amountPerPerson = this.amountPerPerson * this.currentStatus;

          if (this.currency == 'USD') {
            this.currencySymbol = '$';
            this.currencySymboPosition = 'prefix'
          } else {
            this.currencySymbol = '€'
            this.currencySymboPosition = 'suffix'
          }
        });
    },

    changeBlock() {
      document.getElementById('left-block').style.display = 'none';
      document.getElementById('right-block').style.display = 'flex';
    },

    mainBlock() {
      document.getElementById('left-block').style.display = 'flex';
      document.getElementById('right-block').style.display = 'none';
      this.billTotal = '';
    },

    isMobile() {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true
      } else {
        return false
      }
    },

    formatPrice,
  },

  watch: {
    currency() {
      this.initCalc();
    }
  }
}
</script>


<style lang="scss">
.bloco-dir,
.bloco-esq {
  border: 1px solid #c5c5c5;
  border-radius: 10px;
  padding: 40px;

  form {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
}

.form-group {
  justify-content: center;
  display: flex;

  .custom-range {
    padding: 0 10px;
  }

  .inputValorTotal {
    border: 1px solid #cdcdcd;
    padding: 10px;
    font-size: 2rem;
    text-align: center;
    max-width: 200px;
    border-radius: 10px;
    background-color: whitesmoke;
  }

  &--switch {
    >div {
      display: flex;
      flex-direction: row;
    }
  }
}

.bloco-esq {
  display: flex;

  button:disabled,
  button[disabled] {
    border: 1px solid #999999;
    background-color: #cccccc;
    color: #666666;
    cursor: not-allowed;
  }
}

.bloco-dir {
  display: flex;

  >div {
    display: flex;
    padding: 10px 0;
    text-align: center;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    line-height: 1.2;
  }

  .currency-block {
    font-size: 2rem;
  }
}

@media screen and (max-width: 600px) {
  .bloco-dir {
    display: none;
  }

  .mb-next-page {
    display: flex !important;
    justify-content: center;
    align-self: flex-end;
    width: 50px;
    padding: 10px 20px;
    border-radius: 30px;
    color: #fff;
    background: #007bff;
  }

  .mb-main-page {
    display: flex !important;
    justify-content: center;
    align-self: flex-start;
    width: 50px;
    padding: 10px 20px;
    border-radius: 30px;
    color: #fff;
    background: #007bff;
  }

  .bloco-dir,
  .bloco-esq {
    border: none;
  }

}
</style>
