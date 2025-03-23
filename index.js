// The main script for the extension
// The following are examples of some basic extension functionality

//You'll likely need to import extension_settings, getContext, and loadExtensionSettings from extensions.js
import { extension_settings, getContext, loadExtensionSettings } from "../../../extensions.js";

//You'll likely need to import some other functions from the main script
import { saveSettingsDebounced } from "../../../../script.js";

// 设置插件名称和路径
const extensionName = "silly-tavern-input-helper";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;
const defaultSettings = {
    enabled: true
};

// 加载插件设置
async function loadSettings() {
    extension_settings[extensionName] = extension_settings[extensionName] || {};
    if (Object.keys(extension_settings[extensionName]).length === 0) {
        Object.assign(extension_settings[extensionName], defaultSettings);
    }

    // 更新UI中的设置
    $("#enable_input_helper").prop("checked", extension_settings[extensionName].enabled).trigger("input");
}

// 开关设置变更响应
function onEnableInputChange(event) {
    const value = Boolean($(event.target).prop("checked"));
    extension_settings[extensionName].enabled = value;
    saveSettingsDebounced();
    
    if (value) {
        toastr.success("输入助手已启用");
    } else {
        toastr.warning("输入助手已禁用");
    }
}

// 获取输入框元素
function getMessageInput() {
    return $("#send_textarea, #prompt_textarea").first();
}

// 插入引号功能
function insertQuotes() {
    if (!extension_settings[extensionName].enabled) return;
    
    const textarea = getMessageInput();
    const startPos = textarea.prop("selectionStart");
    const endPos = textarea.prop("selectionEnd");
    const text = textarea.val();
    
    const beforeText = text.substring(0, startPos);
    const selectedText = text.substring(startPos, endPos);
    const afterText = text.substring(endPos);
    
    // 插入双引号并将光标放在中间
    const newText = beforeText + "\"\"" + afterText;
    textarea.val(newText);
    
    // 设置光标位置在双引号中间
    setTimeout(() => {
        textarea.prop("selectionStart", startPos + 1);
        textarea.prop("selectionEnd", startPos + 1);
        textarea.focus();
    }, 0);
    
    toastr.info("已插入引号");
}

// 插入换行功能
function insertNewLine() {
    if (!extension_settings[extensionName].enabled) return;
    
    const textarea = getMessageInput();
    const startPos = textarea.prop("selectionStart");
    const endPos = textarea.prop("selectionEnd");
    const text = textarea.val();
    
    const beforeText = text.substring(0, startPos);
    const selectedText = text.substring(startPos, endPos);
    const afterText = text.substring(endPos);
    
    // 在当前位置插入换行符
    const newText = beforeText + "\n" + afterText;
    textarea.val(newText);
    
    // 设置光标位置在换行符之后
    setTimeout(() => {
        textarea.prop("selectionStart", startPos + 1);
        textarea.prop("selectionEnd", startPos + 1);
        textarea.focus();
    }, 0);
    
    toastr.info("已插入换行");
}

// 初始化插件
jQuery(async () => {
    // 加载HTML
    const settingsHtml = await $.get(`${extensionFolderPath}/example.html`);
    $("#extensions_settings").append(settingsHtml);
    
    // 注册事件监听
    $("#insert_quotes_button").on("click", insertQuotes);
    $("#new_line_button").on("click", insertNewLine);
    $("#enable_input_helper").on("input", onEnableInputChange);
    
    // 加载设置
    await loadSettings();
    
    console.log("输入助手插件已加载");
});
