//Пустая ли строка (проверка на пустоую строку)
const { JSDOM } = require('jsdom');
const { document } = new JSDOM('<!doctype html><html><body></body></html>').window;
global.document = document;

function checkFileSelected(fileInput) {
    // Проверяем, есть ли в элементе input[type="file"] выбранный файл
    if (!fileInput.files || fileInput.files.length === 0) {
        return false;
    } else {
        return true;
    }
}

function checkFileNotEmpty(fileInput) {
    // Проверяем, есть ли в элементе input[type="file"] выбранный файл
    if (!checkFileSelected(fileInput)) {
        return false;
    }

    // Получаем первый выбранный файл
    const file = fileInput.files[0];

    // Проверяем, что файл не пустой
    if (file.size === 0) {
        return false;
    }

    return true;
}

function downloadFile(url, fileInput) {
    // Проверяем, есть ли в элементе input[type="file"] выбранный файл
    if (!checkFileSelected(fileInput)) {
        console.error('Please select a file before downloading.');
        return;
    }

    // Проверяем, что файл не пустой
    if (!checkFileNotEmpty(fileInput)) {
        console.error('The selected file is empty. Please select a non-empty file.');
        return;
    }

    // Создаем новый элемент a для загрузки файла
    const link = document.createElement('a');

    // Добавляем выбранный файл в ссылку
    link.href = url;
    link.download = fileInput.files[0].name;

    // Добавляем ссылку на страницу и эмулируем клик по ней
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function checkPdfFile(file) {
    return file.name.endsWith('.pdf');
}

function checkFileName(file, name) {
    if (!file) {
        throw new Error('File is not defined');
    }
    if (name) {
        return file.name === name;
    } else {
        return file.name === '';
    }
}

function checkFileExists(fileInput) {
    const file = fileInput.files[0];
    if (!file) {
        return false;
    }

    const xhr = new XMLHttpRequest();
    xhr.open("HEAD", file.name, false);
    xhr.send();

    if (xhr.status === 404) {
        return false;
    }

    return true;
}

module.exports = { checkFileNotEmpty, checkPdfFile, checkFileName, checkFileExists };