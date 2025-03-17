export interface SavedPrompt {
    id: number; // Уникальный идентификатор
    anamnes_id: number; // ID анамнеза (внешний ключ)
    purpose: string; // Назначение
    prompt_name?: string | null; // Название промпта (необязательное поле)
    prompt: string; // Текст запроса
    gpt_answer: string; // Ответ GPT
    filenames?: string[] | null; // Список файлов (необязательное поле)
    thread_id?: string | null; // ID треда (необязательное поле)
    created_at: string; // Дата создания в формате строки (ISO)
}
  