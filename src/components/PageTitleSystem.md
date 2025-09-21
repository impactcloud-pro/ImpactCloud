# نظام إدارة عناوين الصفحات

نظام متطور لضمان التطابق التلقائي بين عناوين الصفحات وعناصر قائمة التنقل.

## الملفات الأساسية

### 1. `PageTitles.ts`
ملف التكوين المركزي لجميع عناوين الصفحات:
```typescript
export const PAGE_TITLES: Record<string, string> = {
  'dashboard': 'لوحة التحكم',
  'user-management-admin': 'إدارة المستفيدين',
  // ...
};
```

### 2. `withPageTitle.tsx`
مكونات مساعدة لإدارة العناوين ديناميكياً:
- `withPageTitle()` - HOC لتغليف المكونات
- `usePageTitle()` - Hook للتحديث الديناميكي
- `PageTitleContext` - Context للمشاركة

### 3. `EnhancedPageLayout.tsx`
مكون محسن يستخدم النظام الجديد تلقائياً.

## كيفية الاستخدام

### 1. إضافة صفحة جديدة
```typescript
// في PageTitles.ts
export const PAGE_TITLES = {
  // ...
  'new-page': 'العنوان الجديد',
  'new-page-admin': 'عنوان خاص بالمدير', // اختياري للأدوار المختلفة
};
```

### 2. استخدام EnhancedPageLayout
```typescript
export function NewPage({ userRole }: { userRole: UserRole }) {
  return (
    <EnhancedPageLayout
      pageId="new-page"
      userRole={userRole}
      description="وصف الصفحة"
      icon={<Icon className="h-8 w-8" />}
    >
      {/* محتوى الصفحة */}
    </EnhancedPageLayout>
  );
}
```

### 3. تحديث العنوان ديناميكياً
```typescript
export function DynamicPage({ userRole }: { userRole: UserRole }) {
  const { title, updateTitle } = usePageTitle('dynamic-page', userRole);
  
  const handleTitleChange = () => {
    updateTitle('العنوان الجديد المحدث');
  };
  
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={handleTitleChange}>تحديث العنوان</button>
    </div>
  );
}
```

### 4. إضافة صفحة لقائمة التنقل
```typescript
// في Layout.tsx
const getMenuItems = () => {
  // ...
  baseItems.push({
    id: 'new-page',
    label: getPageTitle('new-page', userRole), // سيتم التطابق تلقائياً
    icon: NewIcon
  });
};
```

## الميزات

### ✅ التطابق التلقائي
- عناوين قائمة التنقل تطابق عناوين الصفحات تلقائياً
- لا توجد حاجة لتحديث المواقع المتعددة عند تغيير العنوان

### ✅ دعم الأدوار المختلفة
- عناوين مختلفة لنفس الصفحة حسب دور المستخدم
- مثال: "إدارة المستخدمين" للمدير العام، "إدارة المستفيدين" لمدير أثرنا

### ✅ التحديث الديناميكي
- إمكانية تحديث العناوين أثناء وقت التشغيل
- تحديث تلقائي لقائمة التنقل

### ✅ المرونة
- استخدام عناوين مخصصة عند الحاجة
- دعم السياق (Context) للمشاركة بين المكونات

## المثال الكامل

```typescript
// 1. تعريف العنوان
// في PageTitles.ts
export const PAGE_TITLES = {
  'reports': 'التقارير والإحصائيات',
  'reports-admin': 'تقارير شاملة للنظام'
};

// 2. إنشاء الصفحة
export function ReportsPage({ userRole }: { userRole: UserRole }) {
  return (
    <EnhancedPageLayout
      pageId="reports"
      userRole={userRole}
      description="عرض التقارير والإحصائيات التفصيلية"
      icon={<BarChart3 className="h-8 w-8" />}
    >
      <div>محتوى صفحة التقارير</div>
    </EnhancedPageLayout>
  );
}

// 3. إضافة لقائمة التنقل (في Layout.tsx)
baseItems.push({
  id: 'reports',
  label: getPageTitle('reports', userRole), // سيعرض العنوان المناسب للدور
  icon: BarChart3
});
```

## نصائح هامة

1. **استخدم أسماء مفاتيح واضحة** للصفحات في `PAGE_TITLES`
2. **اتبع النمط المحدد** للعناوين الخاصة بالأدوار: `page-id-role`
3. **اختبر التطابق** بين قائمة التنقل وعناوين الصفحات لجميع الأدوار
4. **وثق أي عناوين ديناميكية** خاصة في التعليقات

هذا النظام يضمن الاتساق والدقة في جميع أنحاء التطبيق تلقائياً! 🚀