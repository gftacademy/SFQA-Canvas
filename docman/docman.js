// Fungsi untuk inisialisasi data docs di Local Storage jika belum ada
function initializeDocsStorage() {
    if (!localStorage.getItem('docs')) {
        let docs = {
            "doc1.md": { 
                title: "Student Portfolio.md", 
                content: "# Introduction\n\n## Section 1.1\n\nContent of section 1.1.\n\n## Section 1.2\n\nContent of section 1.2.![](https://api-portfolio.gft.academy/storage/images/fileAlbum_1723689487589.jpg)" 
            },
            "doc2.md": { 
                title: "Java Fundamental.md", 
                content: "# Software Overview\n\n## Introduction\n\nIntroduction content.\n\n## Details\n\nDetails content." 
            }
        };

        localStorage.setItem('docs', JSON.stringify(docs));
        console.log("Docs initialized and saved to Local Storage.");
    } else {
        console.log("Docs already exist in Local Storage.");
    }
}

// Fungsi untuk mendapatkan semua dokumen dari Local Storage
function getAllDocs() {
    let docs = JSON.parse(localStorage.getItem('docs'));
    return docs;
}

// Fungsi untuk mendapatkan satu dokumen berdasarkan ID
function getDoc(docId) {
    let docs = JSON.parse(localStorage.getItem('docs'));
    return docs[docId] || null;
}

// Fungsi untuk menambahkan dokumen baru
function addDoc(docId, title, content) {
    let docs = JSON.parse(localStorage.getItem('docs'));
    if (!docs[docId]) {
        docs[docId] = { title: title, content: content };
        localStorage.setItem('docs', JSON.stringify(docs));
        console.log(`Document ${docId} added successfully.`);
        return true;
    } else {
        console.log(`Document with ID ${docId} already exists.`);
        return false;
    }
}

// Fungsi untuk mengupdate dokumen yang sudah ada
function updateDoc(docId, title, content) {
    let docs = JSON.parse(localStorage.getItem('docs'));
    if (docs[docId]) {
        docs[docId] = { title: title, content: content };
        localStorage.setItem('docs', JSON.stringify(docs));
        console.log(`Document ${docId} updated successfully.`);
        return true;
    } else {
        console.log(`Document with ID ${docId} does not exist.`);
        return false;
    }
}

// Fungsi untuk menghapus dokumen berdasarkan ID
function deleteDoc(docId) {
    let docs = JSON.parse(localStorage.getItem('docs'));
    if (docs[docId]) {
        delete docs[docId];
        localStorage.setItem('docs', JSON.stringify(docs));
        console.log(`Document ${docId} deleted successfully.`);
        return true;
    } else {
        console.log(`Document with ID ${docId} does not exist.`);
        return false;
    }
}

// Contoh penggunaan:
initializeDocsStorage(); // Inisialisasi data jika belum ada

// Contoh CRUD Operations
addDoc("doc3.md", "New Document.md", "# New Document\n\nThis is a new document.");
updateDoc("doc3.md", "Updated Document.md", "# Updated Document\n\nThis document has been updated.");
let doc = getDoc("doc3.md");
console.log(doc);
deleteDoc("doc3.md");
let allDocs = getAllDocs();
console.log(allDocs);