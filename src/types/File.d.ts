export interface FileData {
    filename: string;
    servername: string;
    fileUrl?: string; // Ссылка на Blob (URL.createObjectURL)
    fileType: string;
    isSelected: boolean
}