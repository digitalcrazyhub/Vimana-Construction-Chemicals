(() => {
  const projectRoot = (() => {
    const path = window.location.pathname;
    const pageIndex = path.indexOf('/page/');

    if (pageIndex >= 0) return path.slice(0, pageIndex);

    const lastSlash = path.lastIndexOf('/');
    return path.slice(0, lastSlash);
  })();

  const pageFiles = new Set([
    'about.html',
    'awards.html',
    'contact.html',
    'privacy-policy.html',
    'product.html',
    'project.html',
    'service.html',
    'team.html',
    'terms.html',
    'Terrace_Cementitious.html',
    'terrace-elastomeric-coating.html',
    'bathroom-epoxy-grouting.html',
    'bathroom-wet-area-waterproofing.html',
    'basement-bituminous-coating-waterproofing.html',
    'concrete-repair-rehabilitation.html',
    'internal-external-wall-waterproofing.html',
    'pu-injection-grouting.html',
    'tank-structure-epoxy-coating.html',
    'water-tank-underground-sump-waterproofing.html'
  ]);
  const pageAliases = new Map([
    ['products.html', 'product.html'],
    ['services.html', 'service.html']
  ]);

  const resolvePath = (value) => {
    if (!value) return value;

    const relativeFile = value.match(/^\.\/?([^/?#]+\.html)([?#].*)?$/);
    if (relativeFile && !window.location.pathname.includes('/page/')) {
      const fileName = relativeFile[1];
      const target = pageAliases.get(fileName) || fileName;
      if (pageFiles.has(target)) return `${projectRoot}/page/${target}${relativeFile[2] || ''}`;
    }

    if (!value.startsWith('/')) return value;

    const path = value.slice(1);
    if (projectRoot && value.startsWith(`${projectRoot}/`)) return value;
    if (!projectRoot && /^(page|assets|css|js|api)\//.test(path)) return value;

    const fileName = path.split(/[?#]/, 1)[0];
    const target = pageAliases.get(fileName) || fileName;

    if (pageFiles.has(target)) return `${projectRoot}/page/${target}${path.slice(fileName.length)}`;
    return `${projectRoot}/${path}`;
  };

  const fixElement = (element) => {
    ['href', 'src', 'poster'].forEach((attribute) => {
      if (element.hasAttribute(attribute)) {
        const value = element.getAttribute(attribute);
        const resolved = resolvePath(value);
        if (resolved !== value) element.setAttribute(attribute, resolved);
      }
    });

    if (element.hasAttribute('style')) {
      const currentStyle = element.style.cssText;
      const resolvedStyle = currentStyle.replace(/url\(\s*["']?(\/[^)"']+)["']?\s*\)/g, (match, value) => {
        return `url("${resolvePath(value)}")`;
      });
      if (resolvedStyle !== currentStyle) element.style.cssText = resolvedStyle;
    }
  };

  const fixPaths = (root = document) => {
    if (root.nodeType === Node.ELEMENT_NODE) fixElement(root);
    root.querySelectorAll?.('[href], [src], [poster], [style]').forEach(fixElement);
  };

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes') fixElement(mutation.target);

      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) fixPaths(node);
      });
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['href', 'src', 'poster', 'style'],
    childList: true,
    subtree: true
  });
  document.addEventListener('DOMContentLoaded', () => fixPaths());
})();
