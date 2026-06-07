import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Props {
    content: string;
}

export default function MarkdownContent({ content }: Props) {
    return (
        <div className="prose dark:prose-invert max-w-none prose-img:rounded-lg prose-img:border prose-img:border-[var(--color-rule)]">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    code({node, inline, className, children, ...props}: any) {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={vscDarkPlus as any}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        )
                    },
                    img: ({ node, ...props }) => {
                        const alt = props.alt || "";
                        let className = "w-full my-8";

                        if (alt.includes("left")) {
                            className = "w-1/2 float-left mr-6 mb-4 mt-2";
                        } else if (alt.includes("right")) {
                            className = "w-1/2 float-right ml-6 mb-4 mt-2";
                        } else if (alt.includes("middle") || alt.includes("center")) {
                            className = "w-2/3 mx-auto my-8 block text-center";
                        }

                        return (
                            <img
                                {...props}
                                className={`${className} rounded-lg border border-[var(--color-rule)] shadow-sm`}
                                loading="lazy"
                            />
                        );
                    },
                    video: ({ node, ...props }) => {
                        return (
                            <video
                                {...props}
                                controls
                                className="w-full my-8 rounded-lg border border-[var(--color-rule)]"
                            />
                        );
                    }
                }}
            >
                {content}
            </ReactMarkdown>
            <div className="clear-both" />
        </div>
    );
}
