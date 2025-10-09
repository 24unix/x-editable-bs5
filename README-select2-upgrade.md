# Select2 Modernization

This fork has been updated to work with **Select2 v4.x** instead of the bundled v3.4.4 from 2013.

## Breaking Changes

### Select2 Dependency
Select2 is now a **peer dependency** and must be installed separately:

```bash
npm install select2@^4.0.0
```

### Include Select2 in Your HTML
You must now include Select2 yourself:

```html
<link href="node_modules/select2/dist/css/select2.css" rel="stylesheet" type="text/css">
<script src="node_modules/select2/dist/js/select2.js"></script>
```

For Bootstrap 5 styling, also include:
```html
<link href="https://cdn.jsdelivr.net/npm/select2-bootstrap-5-theme@1.3.0/dist/select2-bootstrap-5-theme.min.css" rel="stylesheet">
```

## API Changes

### Event Handling
Select2 v4.x uses different event names:
- `select2:select` instead of `select2-loaded`
- `select2:unselect` for deselection

### AJAX Configuration
For remote data sources, use the new v4.x format:

```javascript
$('#element').editable({
    select2: {
        ajax: {
            url: '/api/data',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    query: params.term,
                    page: params.page
                };
            },
            processResults: function (data) {
                return {
                    results: data.map(function(item) {
                        return {
                            id: item.id,
                            text: item.name
                        };
                    })
                };
            }
        }
    }
});
```

### Template Functions
Use `templateResult` and `templateSelection` instead of `formatResult` and `formatSelection`:

```javascript
select2: {
    templateResult: function(item) {
        return item.text;
    },
    templateSelection: function(item) {
        return item.text;
    }
}
```

## Migration Guide

1. **Install Select2 v4.x** as a peer dependency
2. **Include Select2 CSS/JS** in your HTML before x-editable
3. **Update AJAX configurations** to use v4.x format
4. **Update template functions** to use new naming
5. **Test thoroughly** - Select2 v4.x has different behavior

## Debug Mode

The updated code includes console logging for debugging. Check browser console for:
- `[Select2 Debug] value2input called with: ...`
- `[Select2 Debug] Item selected: ...`
- `[Select2 Debug] Change event triggered: ...`