# X-Editable (Bootstrap 5 Fork)

A drop-in replacement for legacy Bootstrap 3 x-editable projects, modernized for **Bootstrap 5** with jQuery support.

## Why This Fork?

This project was created when we needed a **drop-in replacement** for x-editable in a legacy Bootstrap 3 project. The original [vitalets/x-editable](https://github.com/vitalets/x-editable) library has not been actively maintained and doesn't support Bootstrap 5.

**Key Features:**
- **Bootstrap 5** compatibility 
- **jQuery** support maintained
- **Select dropdowns** - fully functional
- **Date pickers** - using bootstrap-datepicker
- **Drop-in replacement** - minimal code changes needed
- **Streamlined codebase** - Bootstrap 5 only, legacy code removed

## Demo

The `/demo` folder contains working examples of the library in action.

**To run the demo:**
```bash
# In the project root directory
php -S 0.0.0.0:8000

# Then visit: http://localhost:8000/demo/
```

The demo showcases:
- Select inputs with AJAX and static data sources
- Date picker functionality
- Basic in-place editing

## Installation

### Dependencies

This library requires:
- **Bootstrap 5** (CSS and JS)
- **jQuery 3.x**
- **bootstrap-datepicker** (for date inputs)

### Quick Start

1. **Include the CSS and JS files:**
```html
<!-- Bootstrap 5 -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

<!-- jQuery -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

<!-- Bootstrap Datepicker -->
<link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.10.0/css/bootstrap-datepicker.min.css" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.10.0/js/bootstrap-datepicker.min.js"></script>

<!-- X-Editable Bootstrap 5 -->
<link href="dist/bootstrap5-editable/css/bootstrap-editable.css" rel="stylesheet">
<script src="dist/bootstrap5-editable/js/bootstrap-editable.js"></script>
```

2. **Initialize editable elements:**
```javascript
$('#my-editable').editable({
    type: 'select',
    source: [
        {value: 1, text: 'Option 1'},
        {value: 2, text: 'Option 2'}
    ],
    url: '/update-endpoint'
});
```

## Migration from Bootstrap 3

If you're migrating from the original x-editable:

1. **Update Bootstrap** to version 5
2. **Add bootstrap-datepicker** dependency (no longer bundled)
3. **Replace x-editable files** with this Bootstrap 5 version
4. **Update CSS classes** if using custom styling (Bootstrap 3 → 5 changes)

The JavaScript API remains largely the same, making it a true drop-in replacement.

## Build

To build the library from source:

```bash
# Install dependencies
npm install

# Build with Grunt
grunt build

# Or build with webpack for demo
npx webpack --mode=development
```

## License

This project maintains the same MIT license as the original x-editable project.

## Credits

- Original [x-editable](https://github.com/vitalets/x-editable) by [Vitaliy Potapov](https://github.com/vitalets)
- Bootstrap 5 modernization and maintenance by this fork
