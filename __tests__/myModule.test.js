global.TextEncoder = require('text-encoding').TextEncoder;
global.TextDecoder = require('text-encoding').TextDecoder;

const { JSDOM } = require('jsdom');
const { document } = new JSDOM('<!doctype html><html><body></body></html>').window;
global.document = document;

function downloadFile(fileInput) {
    if (fileInput.files.length === 0) {
        console.error('Please select a file before downloading.');
        return undefined;
    }
    return true;
}

function checkFileSelected(fileInput) {
    if (fileInput.files.length === 0) {
        //console.error('Please select a file before downloading.');
        return false;
    }
    return true;
}

// Подключаем функцию, которую мы хотим протестировать
// const checkFileNotEmpty = require('../scriptDownloadProtocol');
const { checkFileNotEmpty, checkPdfFile, checkFileName, checkFileExists } = require('../scriptDownloadProtocol.js');

describe('checkFileNotEmpty', () => {
    test('should return false for empty file', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';

        // Создаем пустой файл
        const emptyFile = new File([''], 'empty.pdf', { type: 'text/plain' });

        // Добавляем пустой файл в элемент input[type="file"]
        Object.defineProperty(fileInput, 'files', {
            value: [emptyFile],
            writable: true,
        });

        // Вызываем функцию с пустым файлом
        const result = checkFileNotEmpty(fileInput);

        expect(result).toBeFalsy();
    });

    test('should return true for non-empty file', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';

        // Создаем файл с содержимым
        const fileContent = 'Hello, world!';
        const nonEmptyFile = new File([fileContent], 'nonempty.txt', {
            type: 'text/plain',
        });

        // Добавляем файл с содержимым в элемент input[type="file"]
        Object.defineProperty(fileInput, 'files', {
            value: [nonEmptyFile],
            writable: true,
        });

        // Вызываем функцию с файлом, содержащим текст
        const result = checkFileNotEmpty(fileInput);

        expect(result).toBeTruthy();
    });

    test('should return false if file is not added before download', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        expect(checkFileSelected(fileInput)).toBeFalsy();

        // Создаем мок функцию console.error
        const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => { });

        expect(downloadFile(fileInput)).toBeUndefined();

        // Проверяем, была ли вызвана функция console.error с определенным аргументом
        expect(consoleErrorMock).toHaveBeenCalledWith('Please select a file before downloading.');

        // Восстанавливаем оригинальную функцию console.error
        consoleErrorMock.mockRestore();
    });


    test('should return pdf extension', () => {
        const file = new File(['file contents'], 'example.pdf', { type: 'application/pdf' });
        expect(checkPdfFile(file)).toBe(true);
    });

    // test('should return file name without extension', () => {

    // });

});

describe('checkFileName', () => {
    const file = new File(['file contents'], 'example.pdf', { type: 'application/pdf' });

    test('should return true if file has no name', () => {
        const fileWithoutName = new File(['file contents'], '');
        expect(checkFileName(fileWithoutName)).toBe(true);
    });
});

describe("checkFileExists", () => {
    let xhrMock;
    beforeEach(() => {
        xhrMock = {
            open: jest.fn(),
            send: jest.fn(),
            setRequestHeader: jest.fn(),
            status: 200,
            responseText: "File contents",
        };
        window.XMLHttpRequest = jest.fn(() => xhrMock);
    });

    afterEach(() => {
        delete window.XMLHttpRequest;
    });

    test("should return false if the selected file does not exist", async () => {
        xhrMock.status = 404;
        const fileInput = {
            files: [{ name: "non-existent-file.txt" }]
        };

        const result = await checkFileExists(fileInput);
        expect(result).toBe(false);
        expect(xhrMock.send).toHaveBeenCalledTimes(1);
    });
});
