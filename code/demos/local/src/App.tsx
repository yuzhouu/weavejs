import { useEffect, useRef, useState } from 'react';
import { Weave } from '@inditextech/weave-sdk';
import { ACTIONS, FONTS, NODES, PLUGINS, STORE } from './constants';
import { Toolbar } from './components/toolbar';
import { ToolbarButton } from './components/toolbar-button';
import {
  Square,
  Circle,
  Type,
  MousePointer,
  Hand,
  Brush,
  Eraser,
  Undo,
  Redo,
} from 'lucide-react';
import { WeaveKonvaBaseRenderer } from '@inditextech/weave-renderer-konva-base';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const weaveInstanceRef = useRef<Weave | null>(null);
  const [actualAction, setActualAction] = useState<string>('selectionTool');

  useEffect(() => {
    async function initializeWeave() {
      if (!containerRef.current) return;

      const clientRect = containerRef.current.getBoundingClientRect();

      const renderer = new WeaveKonvaBaseRenderer();

      weaveInstanceRef.current = new Weave(
        {
          store: STORE,
          renderer: renderer,
          nodes: NODES(),
          actions: ACTIONS(),
          plugins: PLUGINS(() => {
            return {
              id: 'user-dummy',
              name: 'User Dummy',
              email: 'user@mail.com',
            };
          }),
          fonts: FONTS(),
          logger: {
            level: 'info',
          },
        },
        {
          container: containerRef.current,
          width: clientRect.width,
          height: clientRect.height,
        }
      );

      await weaveInstanceRef.current.start();

      // 监听 action 变化
      weaveInstanceRef.current.addEventListener(
        'onActiveActionChange',
        (actionName: string) => {
          setActualAction(actionName || 'selectionTool');
        }
      );
    }

    initializeWeave();

    return () => {
      weaveInstanceRef.current?.destroy();
    };
  }, []);

  const triggerTool = (toolName: string) => {
    if (weaveInstanceRef.current && actualAction !== toolName) {
      weaveInstanceRef.current.triggerAction(toolName);
    }
    if (weaveInstanceRef.current && actualAction === toolName) {
      weaveInstanceRef.current.cancelAction(toolName);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 w-full h-full relative">
      <div className="w-200 h-100">
        <div
          ref={containerRef}
          className="bg-white shadow-lg w-full h-full"
        ></div>
      </div>

      {/* 工具栏 */}
      <div className="pointer-events-none absolute left-4 right-4 bottom-4 flex flex-col gap-2 justify-center items-center">
        <Toolbar orientation="horizontal">
          <ToolbarButton
            icon={<Hand size={24} strokeWidth={1.5} />}
            active={actualAction === 'moveTool'}
            onClick={() => triggerTool('moveTool')}
          />
          <ToolbarButton
            icon={<MousePointer size={24} strokeWidth={1.5} />}
            active={actualAction === 'selectionTool'}
            onClick={() => triggerTool('selectionTool')}
          />
          <ToolbarButton
            icon={<Eraser size={24} strokeWidth={1.5} />}
            active={actualAction === 'eraserTool'}
            onClick={() => triggerTool('eraserTool')}
          />

          {/* 分隔符 */}
          <div className="w-[1px] h-5 bg-gray-200 mx-1" />

          <ToolbarButton
            icon={<Square size={24} strokeWidth={1.5} />}
            active={actualAction === 'rectangleTool'}
            onClick={() => triggerTool('rectangleTool')}
          />
          <ToolbarButton
            icon={<Circle size={24} strokeWidth={1.5} />}
            active={actualAction === 'ellipseTool'}
            onClick={() => triggerTool('ellipseTool')}
          />
          <ToolbarButton
            icon={<Brush size={24} strokeWidth={1.5} />}
            active={actualAction === 'brushTool'}
            onClick={() => triggerTool('brushTool')}
          />
          <ToolbarButton
            icon={<Type size={24} strokeWidth={1.5} />}
            active={actualAction === 'textTool'}
            onClick={() => triggerTool('textTool')}
          />

          {/* 分隔符 */}
          <div className="w-[1px] h-5 bg-gray-200 mx-1" />

          <ToolbarButton
            icon={<Undo size={24} strokeWidth={1.5} />}
            onClick={() => {
              if (weaveInstanceRef.current) {
                const store = weaveInstanceRef.current.getStore();
                store.undoStateStep();
              }
            }}
          />
          <ToolbarButton
            icon={<Redo size={24} strokeWidth={1.5} />}
            onClick={() => {
              if (weaveInstanceRef.current) {
                const store = weaveInstanceRef.current.getStore();
                store.redoStateStep();
              }
            }}
          />
        </Toolbar>
      </div>
    </div>
  );
}

export default App;
