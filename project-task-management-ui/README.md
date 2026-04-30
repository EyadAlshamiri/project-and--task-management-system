# Project Task Management UI

تطبيق Angular لإدارة المشاريع والمهام، مبني باستخدام Angular 21 و ng-zorro-antd للواجهة.

## الميزات
- إدارة المشاريع: إضافة، تعديل، حذف، وعرض المشاريع.
- إدارة المهام: إضافة، تعديل، حذف، وعرض المهام المرتبطة بالمشاريع.
- واجهة عربية باستخدام ng-zorro-antd.
- تخزين محلي باستخدام localStorage.

## التقنيات المستخدمة
- Angular 21
- ng-zorro-antd (UI Library)
- TypeScript
- RxJS
- Vitest (للاختبارات)

## التطوير

### تشغيل الخادم المحلي
```bash
ng serve
```
افتح المتصفح على `http://localhost:4200/`.

### البناء للإنتاج
```bash
ng build
```

### الاختبارات
```bash
ng test
```

## هيكل المشروع
```
src/
├── app/
│   ├── core/
│   │   ├── models/          # النماذج (Project, Task)
│   │   └── services/        # الخدمات (ProjectService, TaskService)
│   ├── features/
│   │   ├── projects/        # مكونات المشاريع
│   │   └── tasks/           # مكونات المهام
│   ├── shared/              # مكونات مشتركة
│   ├── app.config.ts        # إعدادات التطبيق
│   ├── app.routes.ts        # التوجيه
│   └── app.html             # القالب الرئيسي
```

## الترخيص
هذا المشروع مفتوح المصدر.

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
