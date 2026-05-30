import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Check, FileVideo, Plus, UploadCloud, X } from "lucide-react";
import "./styles.css";

type Article = {
  id: string;
  title: string;
  status: string;
};

const activeArticles: Article[] = [
  { id: "WB-10482", title: "Футболка oversize белая", status: "Активен" },
  { id: "WB-10457", title: "Худи basic графит", status: "Активен" },
  { id: "WB-10391", title: "Брюки прямые черные", status: "Активен" },
  { id: "WB-10344", title: "Лонгслив молочный", status: "Активен" },
  { id: "WB-10288", title: "Костюм спортивный", status: "Активен" },
];

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
        MainButton?: {
          setText: (text: string) => void;
          show: () => void;
          hide: () => void;
        };
      };
    };
  }
}

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} КБ`;
  return `${(bytes / 1024 / 1024).toFixed(1)} МБ`;
}

function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedArticleId, setSelectedArticleId] = useState(activeArticles[0].id);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const selectedArticle = useMemo(
    () => activeArticles.find((article) => article.id === selectedArticleId),
    [selectedArticleId],
  );

  useEffect(() => {
    window.Telegram?.WebApp?.ready();
    window.Telegram?.WebApp?.expand();
  }, []);

  useEffect(() => {
    const mainButton = window.Telegram?.WebApp?.MainButton;
    if (!mainButton) return;

    if (file && selectedArticle) {
      mainButton.setText(`Присвоить ${selectedArticle.id}`);
      mainButton.show();
    } else {
      mainButton.hide();
    }
  }, [file, selectedArticle]);

  const pickFile = () => inputRef.current?.click();

  const acceptFile = (nextFile?: File) => {
    if (!nextFile) return;
    if (!nextFile.type.startsWith("video/")) {
      alert("Пожалуйста, выберите видеофайл.");
      return;
    }
    setFile(nextFile);
  };

  return (
    <main className="app-shell">
      <section
        className={`upload-zone ${isDragging ? "is-dragging" : ""}`}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          acceptFile(event.dataTransfer.files[0]);
        }}
      >
        <button className="upload-button" type="button" onClick={pickFile} aria-label="Загрузить видео">
          {file ? <FileVideo size={44} /> : <Plus size={52} />}
        </button>

        <input
          ref={inputRef}
          className="file-input"
          type="file"
          accept="video/*"
          capture="environment"
          onChange={(event) => acceptFile(event.target.files?.[0])}
        />

        {file ? (
          <div className="file-card">
            <div>
              <p className="file-name">{file.name}</p>
              <p className="file-meta">{formatSize(file.size)}</p>
            </div>
            <button className="icon-button" type="button" onClick={() => setFile(null)} aria-label="Убрать видео">
              <X size={18} />
            </button>
          </div>
        ) : (
          <div className="upload-copy">
            <h1>Загрузите видео</h1>
            <p>Перетащите файл сюда или нажмите на плюс.</p>
          </div>
        )}
      </section>

      <section className="article-panel">
        <div className="panel-header">
          <div>
            <h2>Какому артикулу присвоить?</h2>
            <p>Последние активные артикулы</p>
          </div>
          <UploadCloud size={22} />
        </div>

        <div className="article-list">
          {activeArticles.map((article) => {
            const isSelected = article.id === selectedArticleId;
            return (
              <button
                className={`article-row ${isSelected ? "is-selected" : ""}`}
                key={article.id}
                type="button"
                onClick={() => setSelectedArticleId(article.id)}
              >
                <span>
                  <strong>{article.id}</strong>
                  <small>{article.title}</small>
                </span>
                {isSelected ? <Check size={20} /> : <em>{article.status}</em>}
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
