import React, { useEffect } from 'react';

function updateMeta(name, content) {
  let tag = document.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function updateProperty(property, content) {
  let tag = document.querySelector(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('property', property);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function updateNamedMeta(name, content) {
  let tag = document.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function Seo({ title, description }) {
  useEffect(() => {
    document.title = `${title} | AveryTech`;
    updateMeta('description', description);
    updateNamedMeta('theme-color', '#020617');
    updateProperty('og:title', `${title} | AveryTech`);
    updateProperty('og:description', description);
    updateProperty('og:type', 'website');
    updateProperty('og:site_name', 'AveryTech');
    updateNamedMeta('twitter:card', 'summary_large_image');
    updateNamedMeta('twitter:title', `${title} | AveryTech`);
    updateNamedMeta('twitter:description', description);
  }, [title, description]);

  return null;
}

export default Seo;
