import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-button',
  imports: [RouterLink],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  readonly label = input('');
  readonly variant = input<ButtonVariant>('secondary');
  readonly type = input<ButtonType>('button');
  readonly routerLink = input<string | readonly string[] | null>(null);
  readonly active = input(false);
  readonly disabled = input(false);

  readonly pressed = output<void>();

  handleClick(): void {
    if (!this.disabled()) {
      this.pressed.emit();
    }
  }
}
