import { Component } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

/**
 * @title Snack-bar with a custom component
 */
@Component({
  selector: "app-snack-bar-component",
  template: ""
})
export class SnackBarMainComponent {
  durationInSeconds = 5;

  constructor(private _snackBar: MatSnackBar) {}

  public openSnackBar() {
    this._snackBar.openFromComponent(SnackBarComponent, {
      duration: this.durationInSeconds * 1000
    });
  }
}

@Component({
  selector: "app-snack-bar-component-snack",
  templateUrl: "./snack-bar.component.html",
  styleUrls: ["./snack-bar.component.css"]
})
export class SnackBarComponent {}
