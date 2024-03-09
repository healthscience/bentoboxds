<template>
  <div id="time-control">
    <div id="time-control-update">
      <div id="time-options" class="series-style">
        <div id="calendar-selector">
          <div id="date-selector-status"  v-bind:class="{ active: calActive }">
            <div id="range-datepicker" v-if="selectedTimeBundle === 'range'" >
              <VueDatePicker class="calendar-view" @open="alertFn" @closed="alertFn" v-model="boxDaterange" :range="{}"></VueDatePicker>
          </div>
          <div id="single-datepicker" v-else-if="selectedTimeBundle === 'single'">
            <VueDatePicker class="calendar-view" @open="alertFn" @closed="alertFn" v-model="boxDate"></VueDatePicker>
          </div>
          <div id="multi-datepicker" v-else-if="selectedTimeBundle === 'multi'">
            <VueDatePicker class="calendar-view" @open="alertFn" @closed="alertFn" v-model="boxDaterange" multi-dates></VueDatePicker>
          </div>
          </div>
          <div id="selected-dates-list" v-if="boxDaterange !== 'date' && boxDaterange?.length > 1">
            <div class="dates-selected" v-for="sdate of boxDaterange">
              {{ sdate }}
            </div>
          </div>
          <div id="time-calendar-tools">
            <div class="time-tools" id="select-range-type">
              <select v-model="selectedTimeBundle" @change.prevent="setTimeBundle()">
                <option v-for="tb in optionTimeBundle" :value="tb.value" :selected="tb.value === selectedTimeBundle">
                  {{ tb.text }}
                </option>
              </select> 
            </div>
            <div class="time-tools">
              <button id="multi-day-clear" @click.prevent="clearMultidays()">Clear</button>
            </div>
            <div class="time-tools">
              <div id="select-time">
                <div v-for="tv in navTime" :key='tv.id' class="context-time">
                  <button class="button is-primary" @click.prevent="setShiftTimeData(tv)">{{ tv.text.word }}</button>
                </div>
              </div>
            </div>
            <div id="update-manual">
              <button id="update-chart" @click.prevent="updateKbundle($event)">Update</button>
            </div>
          </div>
        </div>
        <div id="calendar-list-view" >
          <div class="time-m-list" v-for="datesl in calendarList" :key='datesl.id' >
            {{ datesl }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { DateTime } from 'luxon'
import { ref, onMounted } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

let boxDate = ref()
let boxDaterange = ref([])
let timeRange = ref([])
const calendarvalue = ref('')
const rangeActive = ref([])
const calendarList = ref([])
let calActive = ref(false)
const selectedTimeBundle = ref('single')
const selectedChartnumber = ref('singlechart')
const lang = ref({
  days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  pickers: ['next 7 days', 'next 30 days', 'previous 7 days', 'previous 30 days'],
  placeholder: {
    date: 'Select Date',
    dateRange: 'Select Date Range'
  }
})
const optionTimeBundle = ref([
  { text: 'Single day', value: 'single', id: 0 },
  { text: 'Pick days', value: 'multi', id: 1 },
  { text: 'Range days', value: 'range', id: 2 }
])
const navTime = ref([{ 'text': { 'word': '-day', 'number': -86400000 } }, { 'text': { 'word': '+day', 'number': 86400000 } }])
const selectedTimeFormat = ref('timeseries')
const calendarListMS = ref([])
const makeTimeBundles = ref([])

/* mounted */
onMounted(() => {
  const now = DateTime.now()
  boxDate.value = now
})

/* methods */
const clearMultidays = (md) => {
  boxDaterange.value = []
    // calendarListMS.value = []
    // makeTimeBundles.value = []
  }

  const alertFn = () => {
    calActive.value = !calActive.value
  }

  const calendarSelect = () => {

  let feedbackTime = {}
  feedbackTime.device = this.mData
  feedbackTime.message = 'clear'
  feedbackTime.active = false
  // this.$store.dispatch('actionFeeback', feedbackTime)
  if (calendarToolMulti.active !== true && rangeActive !== true) {
    // convert to correct time format and update KBundle and build new visStyle
    let bTime = {}
    bTime.selectDate = calendarvalue
    bTime.text = 'selectd'
    // let numberTimeformat = moment(this.calendarvalue).valueOf()
    // this.$store.dispatch('singleDateUpdate', numberTimeformat)
    this.calendarListMS = []
    this.calendarListMS.push(numberTimeformat)
    let timeContext = {}
    timeContext.device = mData
    timeContext.timerange = calendarListMS
    // this.$store.dispatch('actionSetTimerange', timeContext)
  } else if (this.rangeActive === true) {
    // reset the timeholder
    this.calendarListMS = []
    let rangeSelected = moment.range(calendarvalue[0], calendarvalue[1])
    let segText = 'days'
    let sourceRangeTimes = Array.from(rangeSelected.by(segText))
    // loop over range and build date range format
    for (let dr of sourceRangeTimes) {
      calendarListMS.push(moment(dr).valueOf())
    }
    // set time range in store so other toolbars have access
    let timeContext = {}
    timeContext.device = mData
    timeContext.timerange = calendarListMS
    // this.$store.dispatch('actionSetTimerange', timeContext)
  } else if (calendarToolMulti.active === true) {
    let formatTimeDisplay = moment(calendarvalue).format('LLll')
    calendarList.push(formatTimeDisplay)
    calendarListMS.push(moment(calendarvalue).valueOf())
    // set time range in store so other toolbars have access
    let timeContext = {}
    timeContext.device = mData
    timeContext.timerange = calendarListMS
    // this.$store.dispatch('actionSetTimerange', timeContext)
  }
}

const setTimeBundle = () => {
  // set calendar type
  if (selectedTimeBundle.value === 'single') {
    selectedTimeBundle.value = 'single'
  } else if (selectedTimeBundle.value === 'range') {
    selectedTimeBundle.value = 'range'
  } else if (selectedTimeBundle.value === 'multi') {
    selectedTimeBundle.value = 'multi'
  }
}

const updateKbundle = () => {
  // prepare update for HOP
  let contextK = {}
  contextK.nxpCNRL = shellID
  contextK.moduleCNRL = moduleCNRL
  contextK.moduleType = moduleType
  contextK.mData = mData
  // contextK.startperiod = moment(calendarvalue).valueOf()
  contextK.startperiodchange = 0
  let rangeSet = []
  if (timeRange === undefined) {
    rangeSet = []
  } else {
    rangeSet = timeRange
  }
  contextK.rangechange = rangeSet
  // contextK.singlechart = true
  contextK.singlechart = selectedChartnumber
  contextK.timeformat = selectedTimeFormat
  // check that time is selected
  if (contextK.rangechange.length === undefined || contextK.rangechange.length === 0) {
    let feedbackDevice = {}
    feedbackDevice.device = this.mData
    feedbackDevice.message = 'please select a date'
    // this.$store.dispatch('actionFeeback', feedbackDevice)
  } else {
    // this.$store.dispatch('actionVisUpdate', contextK)
 }

}

const setShiftTimeData = (seg) => {
  console.log('shift time ')
  console.log(seg)
  console.log(boxDate.value)
  // let updateDate = DateTime.now(boxDate.value).plus({ days: 1 })
  // console.log(updateDate)
}

const cellDateF = () => {
  // startSetDate(this.$store.state.compModuleHolder[moduleCNRL][mData])
  let dateLive = {}
  /* if (this.$store.state.compModuleHolder !== undefined && this.$store.state.compModuleHolder[this.moduleCNRL][this.mData]) {
    let updateDate = moment(this.$store.state.compModuleHolder[this.moduleCNRL][this.mData].date).format('YYYY-MM-DD')
    dateLive = updateDate
  } */
  return dateLive
}

</script>

<style scoped>


@media (min-width: 1024px) {
  #time-context {
    display: grid;
    grid-template-columns: 5fr 1fr;
    border: 0px solid pink;
  }

  #time-control-update {
    display: grid;
    grid-template-columns: 4fr 1fr;
    border: 0px solid black;
  }

  #calendar-selector {
    display: grid;
    grid-template-columns: 1fr;
  }

  .select-caldate {
    min-width: 340px;
  }

  .time-tools {
    border: 0px solid blue;
  }

  #select-range-type {
    margin-top: .2em;
    margin-left: .5em;
    margin-right: .5em;
    margin-bottom: 0.5em;
  }

  .context-time {
    display: inline-block;
    margin: 0em;
  }

  #view-time {
    margin-top: 10px;
    font-size: 1.4em;
  }

  #date-selector-status {
    display: grid;
    grid-template-columns: 1fr;
  }

  .active {
    border: 0px solid red;
    top: -150px;
  }

  #selected-dates-list {
    position: absolute;
    top: 0;
    left: -210px;
    max-width: 200px;
    display: block;
    border: 1px solid blue;
    min-height: 100px;
    background-color: whitesmoke;
    overflow-y: scroll;
    z-index: 14;
  }

  .dates-selected {
    background-color: antiquewhite;
  }

  .calendar-view {
    border: 0px solid blue;
  }

  #calendar-tools {
    display: inline-block;
    padding: 0.4em;
    border: 2px solid white;
  }

  #time-calendar-tools {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  #select-time {
    border: 0px solid orange;
  }

  .time-m-list {
    display: block;
    text-align: left;
    border: 0px solid purple;
  }

  #update-chart {
    font-size: 1em;
    background-color: #4CAF50; /* Green */
    border: none;
    color: white;
    padding: 8px 18px;
    text-align: center;
  }

  .chart-update {
    margin-top: .1em;
    margin-bottom: .5em;
  }

  #calendar-list-view {
    display: inline;
  }

  #chart-options {
    border: 0px solid green;
  }
}
</style>
