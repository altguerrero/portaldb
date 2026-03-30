import { Component, computed, input } from '@angular/core';

import { CharacterStatus } from '../../models/character.model';

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html',
  styleUrl: './status-badge.component.css',
})
export class StatusBadgeComponent {
  readonly status = input.required<CharacterStatus>();
  readonly size = input<'sm' | 'md'>('md');

  readonly label = computed(() =>
    this.status() === 'unknown' ? 'Unknown' : this.status(),
  );
}
