import { Component, Input, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessage } from '../conversation/conversation';
import markdownit from "markdown-it";
import { PNGImageDisplay } from '../pngimage-display/pngimage-display';

const md = markdownit({"breaks": true})

@Pipe({ name: 'parseContent' })
export class ParseContentPipe implements PipeTransform
{
	transform(content: string): string
	{
		return md.render(content);
	}
}

@Component({
	selector: 'app-chatbox',
	imports: [CommonModule, ParseContentPipe, PNGImageDisplay],
	templateUrl: './chatbox.html',
	styleUrl: './chatbox.scss',
})
export class Chatbox
{
	@Input() messages: ChatMessage[] = []
}
