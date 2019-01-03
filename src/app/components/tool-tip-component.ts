import { environment } from '../../environments/environment';

namespace NodeJS {
  export type Timer = any;
}

export class ToolTipComponent {
  isShowTooltip = false;
  private tooltipTimer: NodeJS.Timer;

  toggleToolTip() {
    this.isShowTooltip = !this.isShowTooltip;

    if (this.tooltipTimer) {
      clearTimeout(this.tooltipTimer);
      this.tooltipTimer = undefined;
    }

    if (this.isShowTooltip) {
      this.tooltipTimer = setTimeout(() => {
        this.isShowTooltip = false;
      }, environment.tooltipTimeout);
    }

  }

}
