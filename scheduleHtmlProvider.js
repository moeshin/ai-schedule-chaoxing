function scheduleHtmlProvider(iframeContent = "", frameContent = "", dom = document) {
    return dom.querySelector('iframe[data-id*=queryKbForXsd]')
            .contentDocument.querySelector('table')
            .outerHTML;
}
