import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-pngimage-display',
	imports: [CommonModule],
	templateUrl: './pngimage-display.html'
})
export class PNGImageDisplay
{
	@Input() images: string[] | undefined
	@Input() max_width: string | undefined
}
