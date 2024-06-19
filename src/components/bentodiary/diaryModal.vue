<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-container">
        <div class="modal-header">
          <slot name="header">default header</slot>
        </div>
        <div class="modal-body">
          <div id="ecdiary">Diary Please</div>
          <slot name="body">
            
            default body
          </slot>
        </div>

        <div class="modal-footer">
          <slot name="footer">
            default footer
            <button
              class="modal-default-button"
              @click="$emit('close')"
            >close</button>
          </slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
  import { ref, nextTick, onMounted, onUpdated } from 'vue'

  const props = defineProps({
    show: Boolean
  })

  let ec = ref({})

  // const ecdiary = ref(null)
  let calSettings = {}

  onUpdated(() => {
    console.log('diary')
    console.log(document.getElementById('ecdiary'))
    calSettings = {
      view: 'timeGridWeek',
      headerToolbar: {
          start: 'prev,next today',
          center: 'title',
          end: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek resourceTimeGridWeek,resourceTimelineWeek'
      },
      resources: [
          {id: 1, title: 'Resource A'},
          {id: 2, title: 'Resource B'}
      ],
      scrollTime: '09:00:00',
      events: createEvents(),
      views: {
          timeGridWeek: {pointer: true},
          resourceTimeGridWeek: {pointer: true},
          resourceTimelineWeek: {
              pointer: true,
              slotMinTime: '09:00',
              slotMaxTime: '21:00',
              slotWidth: 80,
              resources: [
                  {id: 1, title: 'Resource A'},
                  {id: 2, title: 'Resource B'},
                  {id: 3, title: 'Resource C'},
                  {id: 4, title: 'Resource D'},
                  {id: 5, title: 'Resource E'},
                  {id: 6, title: 'Resource F'},
                  {id: 7, title: 'Resource G'},
                  {id: 8, title: 'Resource H'},
                  {id: 9, title: 'Resource I'},
                  {id: 10, title: 'Resource J'},
                  {id: 11, title: 'Resource K'},
                  {id: 12, title: 'Resource L'},
                  {id: 13, title: 'Resource M'},
                  {id: 14, title: 'Resource N'},
                  {id: 15, title: 'Resource O'}
              ]
          }
      },
      dayMaxEvents: true,
      nowIndicator: true,
      selectable: true
  }
  // ec = new EventCalendar(ecdiary, {}) 
    nextTick(() => {
      console.log('next tick called')
      let smartCal = document.getElementById('ecdiary')
      console.log('smartc call222')
      console.log(smartCal)
      if (smartCal) {
        ec = new EventCalendar(smartCal, calSettings)
      }
    })

  })

  /* computed */
    // settings for smart diary
    const createEvents = () => {
      let days = [];
      for (let i = 0; i < 7; ++i) {
          let day = new Date();
          let diff = i - day.getDay();
          day.setDate(day.getDate() + diff);
          days[i] = day.getFullYear() + "-" + _pad(day.getMonth()+1) + "-" + _pad(day.getDate());
      }

      return [
          {start: days[0] + " 00:00", end: days[0] + " 09:00", resourceId: 1, display: "background"},
          {start: days[1] + " 12:00", end: days[1] + " 14:00", resourceId: 2, display: "background"},
          {start: days[2] + " 17:00", end: days[2] + " 24:00", resourceId: 1, display: "background"},
          {start: days[0] + " 10:00", end: days[0] + " 14:00", resourceId: 1, title: "The calendar can display background and regular events", color: "#FE6B64"},
          {start: days[1] + " 16:00", end: days[2] + " 08:00", resourceId: 2, title: "An event may span to another day", color: "#B29DD9"},
          {start: days[2] + " 09:00", end: days[2] + " 13:00", resourceId: 2, title: "Events can be assigned to resources and the calendar has the resources view built-in", color: "#779ECB"},
          {start: days[3] + " 14:00", end: days[3] + " 20:00", resourceId: 1, title: "", color: "#FE6B64"},
          {start: days[3] + " 15:00", end: days[3] + " 18:00", resourceId: 1, title: "Overlapping events are positioned properly", color: "#779ECB"},
          {start: days[5] + " 10:00", end: days[5] + " 16:00", resourceId: 2, title: {html: "You have complete control over the <i><b>display</b></i> of events…"}, color: "#779ECB"},
          {start: days[5] + " 14:00", end: days[5] + " 19:00", resourceId: 2, title: "…and you can drag and drop the events!", color: "#FE6B64"},
          {start: days[5] + " 18:00", end: days[5] + " 21:00", resourceId: 2, title: "", color: "#B29DD9"},
          {start: days[1], end: days[3], resourceId: 1, title: "All-day events can be displayed at the top", color: "#B29DD9", allDay: true}
        ];
  }

  const _pad = (num) => {
      let norm = Math.floor(Math.abs(num));
      return (norm < 10 ? '0' : '') + norm;
  }


</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  transition: opacity 0.3s ease;
  opacity: 1;
}

.modal-container {
  z-index: 10;
  width: 92vw;
  height: 92vh;
  margin: auto;
  padding: 20px 30px;
  background: white;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  overflow-y: scroll;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>