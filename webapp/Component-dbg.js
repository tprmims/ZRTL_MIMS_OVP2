sap.ui.define(["sap/ovp/app/Component"], function (OVPComponent) {
    "use strict";

    return OVPComponent.extend("zrtl_mims_ovp2.zrtl_mims_ovp2.Component", {
        metadata: {
            manifest: "json"
        },

        init: function () {
            OVPComponent.prototype.init.apply(this, arguments);

            /*
             * IMPORTANT: do not use sap.ui.getCore().attachUIUpdated here.
             * It is not available in the UI5 runtime used by this system and
             * would abort Component.init(), which also breaks FLP tile navigation.
             */
            this._scheduleUpcomingDeliveriesScroller();
        },

        _scheduleUpcomingDeliveriesScroller: function () {
            var that = this;
            [300, 800, 1500, 3000, 5000].forEach(function (iDelay) {
                window.setTimeout(function () {
                    try {
                        that._applyUpcomingDeliveriesScroller();
                    } catch (oError) {
                        /* Never allow the optional scroller to break the OVP app. */
                        if (window.console && console.warn) {
                            console.warn("Upcoming Deliveries scroller skipped:", oError);
                        }
                    }
                }, iDelay);
            });
        },

        _applyUpcomingDeliveriesScroller: function () {
            var sCardIdPart = "FcardWeeklyDeliveries";
            var aCards = document.querySelectorAll('[id*="' + sCardIdPart + '"]');

            if (!aCards || !aCards.length) {
                return;
            }

            Array.prototype.forEach.call(aCards, function (oCardDom) {
                var oListDom = oCardDom.querySelector(".sapMList");
                var oScrollDom = oCardDom.querySelector(".sapMListTblCnt");

                if (!oListDom || !oScrollDom || !oListDom.id) {
                    return;
                }

                var oTable = sap.ui.getCore().byId(oListDom.id);
                if (!oTable) {
                    return;
                }

                /* Keep the standard OVP row navigation/press handling untouched. */
                if (typeof oTable.setGrowing === "function") {
                    oTable.setGrowing(true);
                }
                if (typeof oTable.setGrowingThreshold === "function") {
                    oTable.setGrowingThreshold(20);
                }
                if (typeof oTable.setGrowingScrollToLoad === "function") {
                    oTable.setGrowingScrollToLoad(false);
                }

                /* OVP initially shows 5 of N. Request the next page so rows 6+
                   are actually rendered inside the table before scrolling. */
                var oBinding = oTable.getBinding && oTable.getBinding("items");
                var iTotal = oBinding && typeof oBinding.getLength === "function" ? oBinding.getLength() : 0;
                var iRendered = oTable.getItems && oTable.getItems().length || 0;
                var oDelegate = oTable._oGrowingDelegate;

                if (iTotal > iRendered && oDelegate && typeof oDelegate.requestNewPage === "function") {
                    oDelegate.requestNewPage();
                }

                /* About five compact OVP rows. Use the table container itself,
                   not the full card, so the card header and actions stay fixed. */
                oScrollDom.style.maxHeight = "292px";
                oScrollDom.style.overflowY = "auto";
                oScrollDom.style.overflowX = "hidden";
                oScrollDom.style.webkitOverflowScrolling = "touch";
            });
        }
    });
});
