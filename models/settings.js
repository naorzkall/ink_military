const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  departments: [String],  // حقل يحتوي على (Array) من أسماء الشعب
  // يمكن إضافة حقول أخرى تتعلق بالإعدادات هنا
});

// إنشاء (Model) بناءً على المخطط المحدد
const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
