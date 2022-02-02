<template>
  <transition name="fadeIn">
    <div class="slideout-panel clearfix" v-if="visible">
      <div
        class="slideout-panel-bg"
        v-on:click="onBgClicked"
        v-if="panelBgVisible"
      ></div>

      <transition-group class="slideout-wrapper" tag="div" name="slideIn">
        <div
          v-bind:id="panel.cssId"
          class="slideout"
          :style="panel.styles"
          :class="getPanelClasses(panel)"
          v-for="panel in panelsWhenVisble"
          @click.stop
          :key="panel.id"
        >
          <div class="slideout-panel-close">
            <div></div>
            <div class="slideout-panel-close-right">
              <font-awesome-icon
                icon="times"
                size="2x"
                :style="{ color: '#222' }"
                class="closeicon"
                @click.stop="closeCurrentPanel(null)"
              />
            </div>
          </div>
          <slot name="panelslot" :panel="panel"></slot>
        </div>
      </transition-group>
    </div>
  </transition>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  components: {
    FontAwesomeIcon,
  },

  data() {
    return {
      visible: false,
      panelsVisible: false,
      panelBgVisible: true,
      panels: [],
    };
  },

  computed: {
    panelsWhenVisble() {
      return this.panelsVisible ? this.panels : [];
    },
  },

  methods: {
    getPanelClasses(panel) {
      let panelClasses = {};
      if (panel.openOn === "left") {
        panelClasses["open-on-left"] = true;
      } else {
        panelClasses["open-on-right"] = true;
      }

      if (!!panel.cssClass) panelClasses[panel.cssClass] = true;
      else panelClasses["slideout-panel-custom-class"] = true;

      return panelClasses;
    },

    closeCurrentPanel(data) {
      if (this.panels.length === 0) return;

      const returnData = !!data ? data : {};
      const currentPanel = this.panels[this.panels.length - 1];
      if (!!currentPanel.closeWhen) {
        //todo: unsub from listener to a special event to close:
        //EventBus.$off(currentPanel.closeWhen, this.closeCurrentPanel);
      }

      this.$emit(`hideSlideOutPanel`, {
        id: currentPanel.id,
        data: returnData, // data is null when cancelling
      });
      const index = this.panels.indexOf(currentPanel);
      this.removePanelStylesheet(currentPanel);
      this.panels.splice(index, 1);
      if (!this.panels || this.panels.length === 0) {
        this.onLastPanelDestroyed();
      }
    },

    showSlideOutPanel(panel) {
      if (!panel) {
        panel = {};
      }
      if (!panel.id) {
        panel.id = "panelnr" + Math.floor(Math.random() * 10000000);
      }
      panel.styles = {
        "z-index": this.panels.length + 100,
      };
      if (!panel.width)
        panel.styles.width = Math.floor(window.innerWidth * 0.9) + "px";
      else if (!panel.width.endsWith || !panel.width.endsWith("px"))
        panel.styles.width = `${panel.width}px`;
      else panel.styles.width = panel.width;
      panel.cssId = `slide-out-panel-${panel.id}`;
      panel.stylesheetId = `slide-out-panel-styles-${panel.id}`;
      this.createPanelStylesheet(panel);

      this.panels.push(panel);
      if (!this.panels || this.panels.length === 1) {
        this.onFirstPanelCreated();
      }
      if (!!panel.closeWhen) {
        //        //todo: subscribe to a special event-handle to close:
        //EventBus.$once(panel.closeWhen, this.closeCurrentPanel);
      }
    },

    createPanelStylesheet(panel) {
      const head = document.head || document.getElementsByTagName("head")[0];
      const style = document.createElement("style");
      style.type = "text/css";
      const css = `@media screen and (max-width:${panel.styles.width}) {
        #${panel.cssId} {
          width: 100% !important;
        }
      }`;
      if (style["styleSheet"]) {
        // This is required for IE8 and below.
        style["styleSheet"].cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }
      style.id = panel.stylesheetId;
      head.appendChild(style);
    },

    removePanelStylesheet(panel) {
      const stylesheet = document.getElementById(panel.stylesheetId);
      try {
        if (!!stylesheet && !!stylesheet.parentNode) {
          stylesheet.parentNode.removeChild(stylesheet);
        }
      } catch (err) {}
    },

    onFirstPanelCreated() {
      this.visible = true;
      setTimeout(() => {
        this.panelsVisible = true;
      }, 300);
      document.addEventListener("keydown", this.onEscapeKeypress);
      document.body.className += " slideout-panel-open";
      const firstPanel = this.panels[0];
      if (firstPanel.hideBg) this.panelBgVisible = false;
    },

    onLastPanelDestroyed() {
      this.panelsVisible = false;
      setTimeout(() => {
        this.visible = false;
      }, 300);
      document.removeEventListener("keydown", this.onEscapeKeypress);
      document.body.className = document.body.className.replace(
        "slideout-panel-open",
        ""
      );
    },

    onBgClicked() {
      const currentPanel = this.panels[this.panels.length - 1];
      if (currentPanel.disableBgClick) return;
      this.closeCurrentPanel(null);
    },

    onEscapeKeypress(e) {
      if (e.keyCode === 27) {
        this.closeCurrentPanel(null);
      }
    },
  },
};
</script>

<style lang="scss">
.closeicon:hover {
  position: relative;
  top: -2px;
}
</style>

<style lang="scss" scoped>
.slideout-panel-open {
  overflow: hidden;
}

.slideout-panel {
  display: block;
  transition: opacity 0.15s;

  &.fadeIn-enter {
    .slideout-panel-bg {
      opacity: 0;
    }
  }

  &.fadeIn-enter-to {
    .slideout-panel-bg {
      opacity: 1;
    }
  }

  &.fadeIn-leave {
    .slideout-panel-bg {
      opacity: 1;
    }
  }

  &.fadeIn-leave-to {
    .slideout-panel-bg {
      opacity: 0;
    }
  }

  .slideout-panel-bg {
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    transition: opacity 0.4s ease;
    overflow-y: hidden;
    z-index: 100;
  }

  .slideout-wrapper {
    position: static;

    .slideout {
      height: 100%;
      position: fixed;
      top: 0;
      bottom: 0;
      background: #ffffff;
      transition: transform 0.18s ease-out;
      overflow-y: auto;

      &.open-on-left {
        right: auto;
        left: 0;

        &.slideIn-enter {
          transform: translateX(-100%);
        }

        &.slideIn-enter-to {
          transform: translateX(0);
        }

        &.slideIn-leave {
          transform: translateX(0);
        }

        &.slideIn-leave-to {
          transform: translateX(-100%);
        }
      }

      &.open-on-right {
        right: 0;
        left: auto;

        &.slideIn-enter {
          transform: translateX(100%);
        }

        &.slideIn-enter-to {
          transform: translateX(0);
        }

        &.slideIn-leave {
          transform: translateX(0);
        }

        &.slideIn-leave-to {
          transform: translateX(100%);
        }
      }
    }
  }
} // end slideout-panel
</style>

<style lang="scss">
$iconHeight: 2em;
.slideout-panel-close {
  display: flex;
  justify-content: space-between;
  z-index: 1000;
  .slideout-panel-close-right {
    padding-right: 10px;
    &:hover {
      cursor: pointer;
    }
  }
  .material-design-icon {
    height: $iconHeight;
    width: $iconHeight;
  }

  .material-design-icon > .material-design-icon__svg {
    height: $iconHeight;
    width: $iconHeight;
    bottom: -0.125 * $iconHeight;
  }
}
</style>
