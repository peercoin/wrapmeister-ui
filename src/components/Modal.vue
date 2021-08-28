<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div
        class="modal"
        role="dialog"
        aria-labelledby="modalTitle"
        aria-describedby="modalDescription"
      >
        <header class="modal-header" id="modalTitle">
          <slot name="header"> </slot>
        </header>

        <section class="modal-body" id="modalDescription">
          <slot name="body">
            {{ body }}
          </slot>
        </section>

        <footer class="modal-footer">
          <slot name="footer"> </slot>

          <div class="d-flex justify-content-center">
            <div class="moditem">
              <m-button type="success" @mbclick="confirm"
                >Confirm</m-button
              >
            </div>
            <div class="moditem">
              <m-button type="danger" @mbclick="close"
                >Cancel</m-button
              >
            </div>
          </div>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script>
import MButton from "@/components/Button.vue";

export default {
  name: "Modal",
  props: {
    body: {
      type: String,
      default: "Proceed with MetaMask?",
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
  components: {
    MButton,
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
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal {
  background: #ffffff;
  box-shadow: 2px 2px 20px 1px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
}

.modal-header,
.modal-footer {
  padding: 15px;
  padding-bottom: 5px;
  display: flex;
}

.modal-header {
  position: relative;
  border-bottom: 1px solid #eeeeee;
  color: #fff;
  justify-content: space-between;
  background-color: #3cb054;
}

.modal-footer {
  border-top: 1px solid #eeeeee;
  flex-direction: column;
}

.modal-body {
  position: relative;
  padding: 20px 10px;
}

.moditem {
  flex-basis: 100px;
  height: 50px;
  margin: 5px;
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.5s ease;
}
</style>
