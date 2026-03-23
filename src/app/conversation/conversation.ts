import { ChangeDetectorRef, Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import ollama, {Message} from "ollama/browser"
import { CommonModule } from '@angular/common';
import { Chatbox } from '../chatbox/chatbox';

export interface ChatMessage extends Message
{
	showThinking?: boolean
}

const tools =
[{
	type: "function",
	function:
	{
		name: "search_web",
		description: "Search the internet for real-time information, news, or facts.",
		parameters:
		{
			type: "object",
			properties:
			{
				query:
				{
					type: "string",
					description: "The search query string (e.g., 'latest AI trends 2024')"
				}
			},
			required: ["query"]
		}
	}
}]

@Component({
	selector: 'app-conversation',
	imports: [FormsModule, CommonModule, Chatbox],
	templateUrl: './conversation.html',
	styleUrl: './conversation.scss',
})
export class Conversation
{
	constructor(private cd: ChangeDetectorRef) {}

	messages: ChatMessage[] = []
	currentMessage: ChatMessage = { role: "user", content: "" }

	generating = false

	async Submit()
	{
		this.generating = true

		this.messages.push(this.currentMessage)
		this.currentMessage = { role: "user", content: "" }

		const response = await ollama.chat({
			model: "qwen3.5:9b",
			messages: this.messages,
			stream: true,
			think: "low",
			keep_alive: 30,
			tools: tools
		})

		const message: ChatMessage =
		{
			role: "assistant",
			content: "",
			thinking: "",
			showThinking: true
		}
		this.messages.push(message)

		for await (const part of response)
		{
			message.content += part.message.content
			message.thinking += part.message.thinking ?? ""

			message.showThinking = message.content.length <= 0

			this.cd.detectChanges()
		}

		this.generating = false
	}
	Abort()
	{
		ollama.abort()
		this.messages.push({role: "system", content: "Generation aborted by user"})
	}
	OnImageSelected(event: Event)
	{
		console.log(event)
	}
	DetectEnterPress(event: KeyboardEvent)
	{
		if (!this.generating && event.key === "Enter" && !event.shiftKey)
		{
			this.Submit()
			event.preventDefault()
		}
	}
}
