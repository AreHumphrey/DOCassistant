import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { FileData } from "@/types/File";

interface FilesState {
  files: FileData[];
  loading: boolean;
  error: string | null;
}

const initialState: FilesState = {
  files: [],
  loading: false,
  error: null,
};

const getMimeTypeFromFilename = (filename: string): string => {
    const extension = filename.split(".").pop()?.toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      pdf: "application/pdf",
      txt: "text/plain",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      json: "application/json",
      csv: "text/csv",
      dcm: "application/dicom",
    };
  
    return mimeTypes[extension || ""] || "application/octet-stream";
};

export const fetchFileByName = createAsyncThunk(
    "files/fetchFileByName",
    async (filename: string, thunkAPI) => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/fileuploading-assistant", {
          headers: { Authorization: `Bearer ${token}` },
          params: { filename },
          responseType: "blob", // Загружаем файл как Blob
        });
  
        // Получаем оригинальное имя файла из Content-Disposition
        const contentDisposition = response.headers["content-disposition"];
        let originalFilename = "unknown_file";
        if (contentDisposition) {
            // Ищем filename* (UTF-8 закодированное имя)
            const filenameMatch = contentDisposition.match(/filename\*=utf-8''(.+?)(?:;|$)/i);
            if (filenameMatch && filenameMatch[1]) {
              // Декодируем закодированное имя файла
              originalFilename = decodeURIComponent(filenameMatch[1]);
            } else {
              // Если filename* отсутствует, ищем обычный filename
              const regularFilenameMatch = contentDisposition.match(/filename="(.+?)"/);
              if (regularFilenameMatch && regularFilenameMatch[1]) {
                originalFilename = decodeURIComponent(regularFilenameMatch[1]);
              }
            }
        }

        // Определяем тип файла из имени
        const fileType = getMimeTypeFromFilename(originalFilename);
  
        // Создаём временный URL для Blob
        const fileUrl = URL.createObjectURL(response.data);
        return { filename: originalFilename, 
          servername: filename, 
          fileUrl: fileUrl, 
          fileType: fileType,
          isSelected: true };
      } catch (error: any) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.detail || "Ошибка загрузки файла"
        );
      }
    }
);

export const fetchFilesByNames = createAsyncThunk(
    "files/fetchFilesByNames",
    async (filenames: string[], thunkAPI) => {
      try {
        const token = localStorage.getItem("token");
  
        // Создаём запросы для всех имён файлов
        const requests = filenames.map((filename) =>
          axios.get("/api/fileuploading-assistant", {
            headers: { Authorization: `Bearer ${token}` },
            params: { filename },
            responseType: "blob",
          }).then((response) => {
            // Получаем оригинальное имя файла из Content-Disposition
            const contentDisposition = response.headers["content-disposition"];
            let originalFilename = "unknown_file";
  
            if (contentDisposition) {
              const filenameMatch = contentDisposition.match(/filename\*=utf-8''(.+?)(?:;|$)/i);
              if (filenameMatch && filenameMatch[1]) {
                originalFilename = decodeURIComponent(filenameMatch[1]);
              } else {
                const regularFilenameMatch = contentDisposition.match(/filename="(.+?)"/);
                if (regularFilenameMatch && regularFilenameMatch[1]) {
                  originalFilename = decodeURIComponent(regularFilenameMatch[1]);
                }
              }
            }
  
            // Определяем MIME-тип файла
            const fileType = getMimeTypeFromFilename(originalFilename);
  
            // Создаём временный URL для Blob
            const fileUrl = URL.createObjectURL(response.data);
  
            return { filename: originalFilename, 
              servername: filename, 
              fileUrl: fileUrl, 
              fileType: fileType, 
              isSelected: true };
          })
        );
  
        // Дожидаемся завершения всех запросов
        const filesData = await Promise.all(requests);
        return filesData; // Возвращаем массив загруженных файлов
      } catch (error: any) {
        return thunkAPI.rejectWithValue("Ошибка загрузки файлов");
      }
    }
);

export const uploadFile = createAsyncThunk(
  "files/uploadFile",
  async (file: File, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      // Создаём FormData и добавляем файл
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("/api/fileuploading-assistant", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Создание Blob из оригинального файла для локального использования
      const blobUrl = URL.createObjectURL(file);
      console.log(blobUrl)

      const fileType = getMimeTypeFromFilename(file.name);
      return { filename: file.name, servername: response.data.uploaded_files[0].filename,
        fileUrl: blobUrl, fileType: fileType, isSelected: true }; // Сервер возвращает данные о загруженном файле
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.detail || "Ошибка загрузки файла"
      );
    }
  }
);

// Slice для файлов
const filesSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    resetFiles(state) {
        // Освобождаем память для Blob URL
        state.files.forEach((file) => {
          if (file.fileUrl) URL.revokeObjectURL(file.fileUrl);
        });
        state.files = [];
    },
    loadFromStorage(state) {
      const storedFiles = localStorage.getItem("selectedFiles");

      // Если данные есть, парсим их; если нет, возвращаем пустой массив
      if (storedFiles) {
          try {
              const parsedFiles: FileData[] = JSON.parse(storedFiles);
              
              state.files = parsedFiles
          } catch (error) {
              console.error("Ошибка парсинга данных из localStorage:", error);
          }
      }
    },
    changeSelection(state, action: PayloadAction<number>) {
      state.files.filter((file, index) => {
        if (index === action.payload) {
          file.isSelected = !file.isSelected
        }
      })
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFileByName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFileByName.fulfilled, (state, action: PayloadAction<FileData>) => {
        state.loading = false;
        state.files.push(action.payload);
      })
      .addCase(fetchFileByName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Обработка загрузки списка файлов
      .addCase(fetchFilesByNames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilesByNames.fulfilled, (state, action: PayloadAction<FileData[]>) => {
        state.loading = false;
        state.files = [...state.files, ...action.payload];
      })
      .addCase(fetchFilesByNames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Загрузка файла
      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state, action: PayloadAction<FileData>) => {
        state.loading = false;
        state.files.push(action.payload); // Добавляем загруженный файл в список
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetFiles, changeSelection, loadFromStorage } = filesSlice.actions;
export default filesSlice.reducer;
