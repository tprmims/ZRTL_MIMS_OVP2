UPCOMING DELIVERIES SCROLL - V4 SAFE FIX

Built from the original uploaded working project.

Root cause fixed:
- Removed sap.ui.getCore().attachUIUpdated(), which is unavailable in the target runtime and stopped the whole component/tile.
- Removed manifest dependency on css/style.css to avoid the stylesheet 404.
- Scroller setup is fully guarded; failure of the optional scroller cannot abort Component.init().
- Only FcardWeeklyDeliveries (WeekDel / Upcoming Deliveries) is targeted.

Deployment: deploy the complete project and invalidate UI5/browser cache.
