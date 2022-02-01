<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div
        class="modal"
        role="dialog"
        aria-labelledby="modalTitle"
        aria-describedby="modalDescription"
      >
        <div class="modal-header pt-4" id="modalTitle">
          <slot name="header"> </slot>
        </div>

        <div class="modal-body" id="modalDescription">
          <slot name="body">
            {{ body }}
          </slot>
        </div>

        <div class="modal-footer">
          <slot name="footer"> </slot>

          <div class="d-grid gap-2 mt-2">
            <button
              class="btn btn-outline-success btn-lg"
              type="button"
              @click="confirm"
            >
              {{ confirmtext }}
            </button>
            <button
              class="btn btn-success btn-lg mb-4 mt-2"
              type="button"
              @click="close"
            >
              {{ canceltext }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Modal",
  props: {
    body: {
      type: String,
      default: "Mint wPPC",
    },
    confirmtext: {
      type: String,
      default: "SELECT",
    },
    canceltext: {
      type: String,
      default: "CANCEL",
    },
  },

  methods: {
    close() {
      this.$emit("modalclose");
    },
    confirm() {
      this.$emit("modalconfirm");
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(39, 97, 11, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal {
  background: #fff;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  color: #3cb054;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 8px;
  max-width: 350px;
  //border: 5px outset #36a04b;
  -webkit-box-shadow: 0px 10px 13px -7px #000000,
    8px 0px 22px -3px rgba(0, 0, 0, 0.55);
  box-shadow: 0px 10px 13px -7px #000000, 8px 0px 22px -3px rgba(0, 0, 0, 0.55);
}

.modal-header,
.modal-footer {
  padding: 15px;
  padding-bottom: 5px;
  display: flex;
}

.modal-header {
  position: relative;
  //border-bottom: 1px solid #eeeeee;
  color: #3cb054;
  justify-content: space-between;
  background-color: #fff;
  font-weight: 500;
  font-size: 110%;
}

.modal-footer {
  // border-top: 1px solid #eeeeee;
  flex-direction: column;
}

.modal-body {
  position: relative;
  padding-top: 1px;
  padding-bottom: 1px;
  padding-left: 1px;
  padding-right: 1px;
}

// .moditem {
//   flex-basis: 100px;
//   height: 50px;
//   margin: 5px;
// }

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.5s ease;
}
</style>
