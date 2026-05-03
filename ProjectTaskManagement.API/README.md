# نظام إدارة المشاريع والمهام - واجهة البرمجة (Project Task Management API)

واجهة برمجة تطبيقات (Web API) قوية ومبنية باستخدام **ASP.NET Core** لإدارة العمليات الخلفية لنظام إدارة المشاريع والمهام.

---

## 🚀 كيفية تشغيل المشروع (Getting Started)

اتبع الخطوات التالية لتجهيز وتشغيل الواجهة البرمجية على جهازك.

### 📋 المتطلبات المسبقة (Prerequisites)

تأكد من تثبيت الأدوات التالية:

- **.NET SDK**: إصدار 10.0 أو أحدث.
- **SQL Server**: قاعدة بيانات لتخزين البيانات.
- **Entity Framework Core CLI**: لتنفيذ عمليات الهجرة (Migrations). يمكنك تثبيته عبر:
  ```bash
  dotnet tool install --global dotnet-ef
  ```

### 🛠️ خطوات التثبيت (Installation Steps)

1. **إعداد قاعدة البيانات (Database Setup):**
   قم بفتح ملف `appsettings.json` في مشروع `ProjectTaskManagement.API` وتعديل سلسلة الاتصال (ConnectionString) لتناسب جهازك:

   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=YOUR_SERVER_NAME;Database=ProjectTaskManagementDB;Trusted_Connection=True;TrustServerCertificate=True"
   }
   ```

2. **إعداد قاعدة البيانات (Database Setup)**
   تبع الخطوات التالية لتنفيذ الـ Migrations وتحديث قاعدة البيانات:

   من الشريط العلوي في Visual Studio:
   اختر Tools
   ثم اختر NuGet Package Manager
   بعد ذلك اضغط على Package Manager Console
   من داخل نافذة Package Manager Console:

   تأكد من اختيار المشروع التالي كـ Default Project:

   ProjectTaskManagement.Infrastructure

   تنفيذ أمر إنشاء Migration:

   ```bash
   Add-Migration Migration_Name
   ```

   تحديث قاعدة البيانات:

   ```bash
   Update-Database
   ```

3. **تشغيل المشروع (Run the Application):**
   انتقل إلى مجلد المشروع الرئيسي وقم بالتشغيل:

   ```bash
   dotnet run --project ProjectTaskManagement.API
   ```

4. **التوثيق (API Documentation):**
   بمجرد التشغيل، يمكنك الوصول إلى واجهة **Swagger** للمعاينة واختبار الروابط عبر:
   [http://localhost:5241/swagger](http://localhost:5241/swagger) (قد يختلف المنفذ حسب إعداداتك).

---

## 🏗️ بنية المشروع (Architecture)

يعتمد المشروع على بنية الطبقات (Layered Architecture) لضمان فصل المهام:

- **ProjectTaskManagement.API:** الطبقة الخارجية التي تحتوي على المتحكمات (Controllers) والإعدادات.
- **ProjectTaskManagement.Core:** تحتوي على النماذج (Entities) وواجهات الخدمات (Interfaces).
- **ProjectTaskManagement.Service:** تحتوي على منطق العمل (Business Logic) وتطبيق الخدمات.
- **ProjectTaskManagement.Data:** تحتوي على سياق قاعدة البيانات (DbContext) والتهجيرات (Migrations).
- **ProjectTaskManagement.Infrastructure:** تحتوي على الإعدادات الخارجية والبنية التحتية.

---

## ✨ المميزات التقنية (Technical Features)

- **Clean Architecture:** لسهولة الصيانة والتوسع.
- **Entity Framework Core:** للتعامل السلس مع قاعدة البيانات.
- **CORS Configuration:** مهيأ للسماح بالاتصال من واجهة Angular (http://localhost:4200).
- **Global Exception Handling:** نظام موحد لمعالجة الأخطاء.
- **Swagger/OpenAPI:** توثيق كامل للروابط البرمجية.

---

## 📧 التواصل (Contact)

+967 738 928 202  
engineeriyadalshamiri@gmail.com

---

> تم تطوير هذا المشروع ليكون متوافقاً تماماً مع واجهة Angular الخاصة بالنظام.
