export abstract class TooltipComponent {

  isTooltipVisible: boolean = false;

  toggleTooltip = (mouseEvent: MouseEvent & { handledTooltipToggle: TooltipComponent }) => {
    this.isTooltipVisible = !this.isTooltipVisible;
    // prevent handling the toggle both on `toggleTooltip` and `clickedOutside`
    mouseEvent.handledTooltipToggle = this;
  }

  clickedOutside = (mouseEvent: MouseEvent & { handledTooltipToggle: TooltipComponent }) => {
    if (mouseEvent.handledTooltipToggle !== this) {
      this.isTooltipVisible = false;
    }
  }

}
