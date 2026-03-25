import React from 'react';

export function ContentBlocks({ blocks }) {
  if (!blocks || !Array.length) return null;

  return (
    <div className="content-blocks">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'heading':
            return <HeadingBlock key={index} block={block} />;
          case 'text':
            return <TextBlock key={index} block={block} />;
          case 'video':
            return <VideoBlock key={index} block={block} />;
          case 'image':
            return <ImageBlock key={index} block={block} />;
          case 'list':
            return <ListBlock key={index} block={block} />;
          case 'table':
            return <TableBlock key={index} block={block} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

function HeadingBlock({ block }) {
  const Tag = `h${block.level}`;
  return (
    <div className={`content-card heading-card level-${block.level}`}>
      <Tag className={`heading-level-${block.level}`}>{block.content}</Tag>
    </div>
  );
}

function TextBlock({ block }) {
  return (
    <div className="content-card text-card">
      <p>{block.content}</p>
    </div>
  );
}

function VideoBlock({ block }) {
  return (
    <div className="content-card video-card">
      {block.title && <h4 className="video-title">{block.title}</h4>}
      <div className="video-wrapper">
        <iframe
          src={block.url}
          title={block.title || 'Video player'}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}

function ImageBlock({ block }) {
  return (
    <div className="content-card image-card">
      <img src={block.url} alt={block.alt || 'Course illustration'} />
    </div>
  );
}

function ListBlock({ block }) {
  const Tag = block.ordered ? 'ol' : 'ul';
  return (
    <div className="content-card list-card">
      <Tag>
        {block.items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </Tag>
    </div>
  );
}

function TableBlock({ block }) {
  return (
    <div className="content-card table-card">
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {block.headers.map((h, i) => <th key={i}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => <td key={j}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
