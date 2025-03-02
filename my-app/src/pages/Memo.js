import React, { useState, useEffect, useRef } from "react";

const Memo = () => {
  const editorRef = useRef(null); // 에디터 참조
  const [savedMemo, setSavedMemo] = useState(""); // 저장된 메모 상태

  // 기존 저장된 데이터 불러오기
  useEffect(() => {
    const savedData = localStorage.getItem("memos");
    if (savedData) {
      setSavedMemo(savedData);
      editorRef.current.innerHTML = savedData; // 저장된 내용 불러오기
    }
  }, []);

  // 파일 업로드 핸들러
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const editor = editorRef.current;

    files.forEach((file) => {
      const fileURL = URL.createObjectURL(file);
      let element;

      if (file.type.startsWith("image/")) {
        element = `<img src="${fileURL}" alt="${file.name}" style="max-width:100%; height:auto; border-radius:5px; margin:5px 0;" />`;
      } else if (file.type.startsWith("video/")) {
        element = `<video controls style="max-width:100%; height:auto; border-radius:5px; margin:5px 0;">
                      <source src="${fileURL}" type="${file.type}" />
                      지원되지 않는 형식입니다.
                   </video>`;
      }

      if (element) {
        document.execCommand("insertHTML", false, element);
      }
    });

    e.target.value = ""; // 파일 선택 초기화
  };

  // 작성 완료 (저장) 핸들러
  const handleSaveMemo = () => {
    if (editorRef.current) {
      const memoContent = editorRef.current.innerHTML;
      localStorage.setItem("memos", memoContent);
      setSavedMemo(memoContent); // 저장된 내용 업데이트
      alert("메모가 저장되었습니다! ✅");
    }
  };

  // 메모 삭제 핸들러
  const handleDeleteMemo = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
      localStorage.removeItem("memos");
      setSavedMemo(""); // 저장된 내용 초기화
      alert("메모가 삭제되었습니다! 🗑️");
    }
  };

  return (
    <div style={styles.container}>
      <h2>📝 MS Word 스타일 메모장</h2>

      {/* 에디터 */}
      <div
        ref={editorRef}
        contentEditable
        style={styles.editor}
        placeholder="여기에 글을 작성하세요..."
      ></div>

      {/* 파일 업로드 */}
      <input type="file" accept="image/*,video/*" multiple onChange={handleFileUpload} />

      {/* 버튼 */}
      <div style={styles.buttonContainer}>
        <button style={styles.saveButton} onClick={handleSaveMemo}>작성 완료</button>
        <button style={styles.deleteButton} onClick={handleDeleteMemo}>삭제</button>
      </div>

      {/* 저장된 메모 미리보기 */}
      {savedMemo && (
        <div style={styles.savedMemoContainer}>
          <h3>📌 저장된 메모</h3>
          <div dangerouslySetInnerHTML={{ __html: savedMemo }} style={styles.savedMemo}></div>
        </div>
      )}
    </div>
  );
};

// 스타일
const styles = {
  container: { padding: "20px", maxWidth: "600px", margin: "auto" },
  editor: {
    width: "100%",
    minHeight: "200px",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    background: "#f9f9f9",
    outline: "none",
    whiteSpace: "pre-wrap",
  },
  buttonContainer: { marginTop: "10px", display: "flex", gap: "10px" },
  saveButton: {
    padding: "10px 20px",
    background: "blue",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  deleteButton: {
    padding: "10px 20px",
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  savedMemoContainer: {
    marginTop: "20px",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    background: "#f0f0f0",
  },
  savedMemo: {
    fontSize: "16px",
    whiteSpace: "pre-wrap",
  },
};

export default Memo;
