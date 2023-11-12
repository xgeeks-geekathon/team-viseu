import { useState } from "react";

const prompts: string[] = [
  "Show a list of tickets done on the sprint 45/2023?",
  "How much time will it take to complete the tickets pending for sprint 46/2023?",
  "What's our average time spent in blocked?",
  "Which ticket spent more time blocked? How long was it blocked for?",
  "Show me the tickets associated with the OKR 'Increase conversion rate'?",
  "Show me a list with the details of the ticket 'Implement Gamification Elements'",
  "Can you provide an update on the current status of the new Product Recommendation Algorithm?",
  "What tickets have we completed in the past four weeks?",
  "Show me a list with the tickets pending to finish the current sprint?",
];

export const PromptInput = ({
  onSubmit,
  disabled = false,
}: {
  onSubmit: (prompt: string) => unknown;
  disabled?: boolean;
}) => {
  const [selectedPrompt, setSelectedPrompt] = useState<string>("");
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([]);

  const matchPrompts = (value: string) => {
    const suggestions =
      value.length === 0
        ? []
        : prompts.filter((prompt) => {
            const regex = new RegExp(`${value}`, "i");
            return prompt.match(regex);
          });

    return suggestions;
  };

  const selectSuggestion = (prompt: string) => {
    setSelectedPrompt("");
    setSuggestedPrompts([]);
    onSubmit(prompt);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const matches = matchPrompts(event.currentTarget.value);
    setSuggestedPrompts(matches);
    setSelectedPrompt(event.currentTarget.value);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && event.currentTarget.value !== "") {
      setSelectedPrompt("");
      onSubmit(event.currentTarget.value);
    }
  };

  return (
    <div className="w-full relative">
      <input
        autoFocus={true}
        name="prompt"
        value={selectedPrompt}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className={`w-full text-black flex-auto rounded-t-md ${suggestedPrompts.length > 0 ? '' : 'rounded-b-md'} border-0 px-3.5 py-2 shadow-sm focus:outline-none  sm:text-sm sm:leading-6`}
        placeholder="Start typing to get prompt suggestions"
        disabled={disabled}
      />
      {suggestedPrompts.length > 0 && (
        <div className="absolute bg-gray-800 z-50 w-full p-2 rounded-b-md border-0 text-white shadow-sm ring-1 ring-inset ring-white/10">
          <div className="max-h-80 overflow-auto">
            {suggestedPrompts.slice(0, 10).map((prompt) => (
              <button
                onClick={() => selectSuggestion(prompt)}
                key={prompt}
                className="w-full text-left hover:bg-sky-950 px-1 py-1 cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
