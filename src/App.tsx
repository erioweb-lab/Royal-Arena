import React, { useState, useEffect, useRef } from 'react';
import {
  Gamepad2,
  GitBranch,
  GitCommit,
  GitPullRequest,
  ArrowUpRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  FileCode2,
  ScrollText,
  Sliders,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  Maximize2,
  FolderGit2,
  Save,
  Send,
  Sparkles,
  Info
} from 'lucide-react';

interface GitStatus {
  branch: string;
  changedFiles: { status: string; file: string }[];
  isClean: boolean;
  recentCommits: { hash: string; author: string; date: string; message: string }[];
  remote: string;
  repoPath: string;
}

interface FileItem {
  name: string;
  desc: string;
  size: number;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'play' | 'git' | 'roadmap' | 'editor'>('play');
  const [gitStatus, setGitStatus] = useState<GitStatus | null>(null);
  const [loadingGit, setLoadingGit] = useState<boolean>(false);
  const [commitMsg, setCommitMsg] = useState<string>('');
  const [isPushing, setIsPushing] = useState<boolean>(false);
  const [isPulling, setIsPulling] = useState<boolean>(false);
  const [actionLog, setActionLog] = useState<{ type: 'info' | 'success' | 'error'; text: string; time: string }[]>([]);

  // Viewport mode for the game
  const [gameViewMode, setGameViewMode] = useState<'mobile' | 'tablet' | 'full'>('mobile');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Files & Editor
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>('게임성-개선-방안.md');
  const [fileContent, setFileContent] = useState<string>('');
  const [loadingFile, setLoadingFile] = useState<boolean>(false);
  const [isSavingFile, setIsSavingFile] = useState<boolean>(false);
  const [fileModified, setFileModified] = useState<boolean>(false);

  // Diff view
  const [diffText, setDiffText] = useState<string>('');

  const appendLog = (type: 'info' | 'success' | 'error', text: string) => {
    const time = new Date().toLocaleTimeString();
    setActionLog(prev => [{ type, text, time }, ...prev.slice(0, 49)]);
  };

  const fetchGitStatus = async () => {
    setLoadingGit(true);
    try {
      const res = await fetch('/api/git/status');
      if (!res.ok) throw new Error('Git 상태를 불러오지 못했습니다.');
      const data: GitStatus = await res.json();
      setGitStatus(data);
    } catch (err: any) {
      appendLog('error', err.message || 'Git 상태 조회 실패');
    } finally {
      setLoadingGit(false);
    }
  };

  const fetchDiff = async () => {
    try {
      const res = await fetch('/api/git/diff');
      if (res.ok) {
        const data = await res.json();
        setDiffText(data.diff || '');
      }
    } catch {
      // ignore
    }
  };

  const fetchFiles = async () => {
    try {
      const res = await fetch('/api/files/list');
      if (res.ok) {
        const data = await res.json();
        setFiles(data.files || []);
      }
    } catch {
      // ignore
    }
  };

  const loadFileContent = async (fileName: string) => {
    setLoadingFile(true);
    try {
      const res = await fetch(`/api/files/read?file=${encodeURIComponent(fileName)}`);
      if (!res.ok) throw new Error('파일을 읽지 못했습니다.');
      const data = await res.json();
      setFileContent(data.content);
      setSelectedFile(fileName);
      setFileModified(false);
    } catch (err: any) {
      appendLog('error', `${fileName} 읽기 실패: ${err.message}`);
    } finally {
      setLoadingFile(false);
    }
  };

  const saveFileContent = async () => {
    if (!selectedFile) return;
    setIsSavingFile(true);
    try {
      const res = await fetch('/api/files/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: selectedFile, content: fileContent }),
      });
      if (!res.ok) throw new Error('저장 실패');
      appendLog('success', `[${selectedFile}] 로컬 저장 완료!`);
      setFileModified(false);
      fetchGitStatus();
      fetchDiff();
      // If index.html was saved, reload game
      if (selectedFile === 'index.html' && iframeRef.current) {
        iframeRef.current.src = '/game-view/index.html?t=' + Date.now();
      }
    } catch (err: any) {
      appendLog('error', `저장 오류: ${err.message}`);
    } finally {
      setIsSavingFile(false);
    }
  };

  const handleCommitAndPush = async () => {
    if (!commitMsg.trim()) {
      alert('커밋 메시지를 입력해주세요.');
      return;
    }
    setIsPushing(true);
    appendLog('info', `GitHub 푸시 시작: "${commitMsg}"...`);
    try {
      const res = await fetch('/api/git/commit-and-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: commitMsg }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '푸시 실패');
      appendLog('success', `GitHub 푸시 완료! (origin/main)`);
      if (data.pushOutput) appendLog('info', data.pushOutput);
      setCommitMsg('');
      fetchGitStatus();
      fetchDiff();
    } catch (err: any) {
      appendLog('error', `푸시 실패: ${err.message}`);
    } finally {
      setIsPushing(false);
    }
  };

  const handleGitPull = async () => {
    setIsPulling(true);
    appendLog('info', 'GitHub origin/main에서 최신 커밋 가져오는 중 (git pull)...');
    try {
      const res = await fetch('/api/git/pull', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Pull 실패');
      appendLog('success', `Git pull 성공: ${data.output}`);
      fetchGitStatus();
      fetchDiff();
      if (iframeRef.current) {
        iframeRef.current.src = '/game-view/index.html?t=' + Date.now();
      }
    } catch (err: any) {
      appendLog('error', `Git pull 실패: ${err.message}`);
    } finally {
      setIsPulling(false);
    }
  };

  const reloadGame = () => {
    if (iframeRef.current) {
      iframeRef.current.src = '/game-view/index.html?t=' + Date.now();
      appendLog('info', '게임 화면을 새로고침했습니다.');
    }
  };

  useEffect(() => {
    fetchGitStatus();
    fetchFiles();
    fetchDiff();
    loadFileContent('게임성-개선-방안.md');
    appendLog('info', 'Royal Arena 연동 스튜디오 준비 완료.');
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#09111e] text-slate-100 font-sans select-none overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="h-14 border-b border-slate-800 bg-[#0e1726]/95 px-4 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20">
            👑
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-wide bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                ROYAL ARENA
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                GitHub Live Sync
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-[260px] md:max-w-md">
              erioweb-lab/Royal-Arena (main)
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('play')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'play'
                ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span className="hidden sm:inline">게임 플레이</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('git');
              fetchGitStatus();
              fetchDiff();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'git'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            <span className="hidden sm:inline">Git 푸시 & 동기화</span>
            {gitStatus && !gitStatus.isClean && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse ml-0.5" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'roadmap'
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ScrollText className="w-4 h-4" />
            <span className="hidden sm:inline">개선 로드맵</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('editor');
              fetchFiles();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'editor'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileCode2 className="w-4 h-4" />
            <span className="hidden sm:inline">코드 & 문서</span>
          </button>
        </div>

        {/* Quick External Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={reloadGame}
            title="게임 리로드"
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700/60"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <a
            href="https://github.com/erioweb-lab/Royal-Arena"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700/60 text-xs font-medium"
          >
            <span className="hidden md:inline">GitHub</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </header>

      {/* Main Tab Views */}
      <main className="flex-1 overflow-hidden relative">
        {/* TAB 1: GAME PLAY */}
        <div
          className={`w-full h-full flex flex-col items-center justify-center p-2 sm:p-4 bg-radial from-[#152338] to-[#09111e] ${
            activeTab === 'play' ? 'flex' : 'hidden'
          }`}
        >
          {/* Game Top Control Toolbar */}
          <div className="w-full max-w-5xl mb-2 flex items-center justify-between px-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Runtime
              </span>
              <span className="text-slate-400">클릭 또는 터치로 카드를 필드에 소환하세요</span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setGameViewMode('mobile')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition ${
                  gameViewMode === 'mobile'
                    ? 'bg-slate-700 text-white font-medium shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="모바일 뷰포트 (390 x 844)"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>390px</span>
              </button>
              <button
                onClick={() => setGameViewMode('tablet')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition ${
                  gameViewMode === 'tablet'
                    ? 'bg-slate-700 text-white font-medium shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="태블릿 뷰포트 (540 x 960)"
              >
                <Smartphone className="w-3.5 h-3.5 rotate-90" />
                <span>540px</span>
              </button>
              <button
                onClick={() => setGameViewMode('full')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition ${
                  gameViewMode === 'full'
                    ? 'bg-slate-700 text-white font-medium shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="전체 화면 너비"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>전체 너비</span>
              </button>
            </div>
          </div>

          {/* Game Frame Container */}
          <div
            className={`relative transition-all duration-300 rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl bg-black ${
              gameViewMode === 'mobile'
                ? 'w-full max-w-[410px] h-[calc(100vh-120px)]'
                : gameViewMode === 'tablet'
                ? 'w-full max-w-[560px] h-[calc(100vh-120px)]'
                : 'w-full max-w-5xl h-[calc(100vh-120px)]'
            }`}
          >
            <iframe
              ref={iframeRef}
              src="/game-view/index.html"
              title="Royal Arena Live"
              className="w-full h-full border-0 select-none bg-slate-950"
              allow="autoplay; fullscreen"
            />
          </div>
        </div>

        {/* TAB 2: GIT SYNC & COMMIT */}
        <div
          className={`w-full h-full overflow-y-auto p-4 md:p-6 max-w-5xl mx-auto flex-col gap-6 ${
            activeTab === 'git' ? 'flex' : 'hidden'
          }`}
        >
          {/* Header Card */}
          <div className="bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/40 p-5 rounded-2xl border border-blue-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-bold text-white">GitHub 저장소 양방향 연동</h2>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  PAT 인증 완료
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                로컬 작업 파일 변경 사항을 커밋하고 GitHub <code className="text-blue-300">origin/main</code>으로 원클릭 푸시합니다.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleGitPull}
                disabled={isPulling}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isPulling ? 'animate-spin' : ''}`} />
                <span>원격 최신 당겨오기 (Pull)</span>
              </button>
              <button
                onClick={fetchGitStatus}
                disabled={loadingGit}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                title="상태 새로고침"
              >
                <RefreshCw className={`w-4 h-4 ${loadingGit ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Commit & Push Form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Commit Input Box */}
              <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GitCommit className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold text-slate-200">GitHub에 커밋 & 푸시 (Push)</h3>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    브랜치: <strong className="text-amber-300">{gitStatus?.branch || 'main'}</strong>
                  </span>
                </div>

                {/* Quick Tag Templates */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'feat: ',
                    'fix: ',
                    'balance: ',
                    'docs: ',
                    'refactor: ',
                    'v188: ',
                  ].map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setCommitMsg(prev => (prev.startsWith(tag) ? prev : tag + prev))}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 border border-slate-700/60 transition"
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                <textarea
                  value={commitMsg}
                  onChange={e => setCommitMsg(e.target.value)}
                  placeholder="예: fix(v188): 엘릭서 낭비 방지 펄스 경고 및 신규 카드 밸런스 조정"
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono resize-none"
                />

                <div className="flex items-center justify-between pt-1">
                  <div className="text-xs text-slate-400 flex items-center gap-1.5">
                    {gitStatus?.isClean ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        작업 트리가 깨끗합니다 (수정된 파일 없음)
                      </span>
                    ) : (
                      <span className="text-amber-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {gitStatus?.changedFiles.length}개 파일 변경됨
                      </span>
                    )}
                  </div>

                  <button
                    onClick={handleCommitAndPush}
                    disabled={isPushing || !commitMsg.trim()}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Send className={`w-3.5 h-3.5 ${isPushing ? 'animate-bounce' : ''}`} />
                    <span>{isPushing ? 'GitHub에 푸시 중...' : 'GitHub에 커밋 & 푸시'}</span>
                  </button>
                </div>
              </div>

              {/* Working Tree Changes / Diff */}
              <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <FileCode2 className="w-4 h-4 text-blue-400" />
                    수정된 파일 상태 (Git Working Tree)
                  </h3>
                  <button
                    onClick={fetchDiff}
                    className="text-xs text-blue-400 hover:underline"
                  >
                    Diff 새로고침
                  </button>
                </div>

                {gitStatus?.changedFiles && gitStatus.changedFiles.length > 0 ? (
                  <div className="space-y-1.5">
                    {gitStatus.changedFiles.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs font-mono"
                      >
                        <span className="text-slate-200">{item.file}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.status === 'M'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : item.status === '??'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}
                        >
                          {item.status === 'M' ? 'Modified' : item.status === '??' ? 'Untracked' : item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                    현재 수정된 파일이 없습니다. 코드를 편집하거나 저장하면 여기에 표시됩니다.
                  </div>
                )}

                {diffText && (
                  <div className="mt-3">
                    <div className="text-[11px] font-semibold text-slate-400 mb-1">Git Diff:</div>
                    <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 max-h-56 overflow-y-auto whitespace-pre-wrap">
                      {diffText}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar: Recent Commits & Logs */}
            <div className="space-y-6">
              {/* Recent Commits */}
              <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <GitPullRequest className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-bold text-slate-200">최근 커밋 이력</h3>
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {gitStatus?.recentCommits && gitStatus.recentCommits.length > 0 ? (
                    gitStatus.recentCommits.map((c, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60 text-xs space-y-1 hover:border-slate-700 transition"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-blue-400 font-bold">{c.hash}</span>
                          <span className="text-[10px] text-slate-500">{c.date}</span>
                        </div>
                        <p className="text-slate-200 font-medium line-clamp-2">{c.message}</p>
                        <div className="text-[10px] text-slate-500">작성자: {c.author}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-500 text-center py-4">커밋 정보를 불러오는 중...</div>
                  )}
                </div>
              </div>

              {/* Action Log Box */}
              <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  실행 로그
                </h3>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 h-44 overflow-y-auto text-[11px] font-mono space-y-1.5">
                  {actionLog.map((log, index) => (
                    <div
                      key={index}
                      className={`leading-tight ${
                        log.type === 'error'
                          ? 'text-red-400'
                          : log.type === 'success'
                          ? 'text-emerald-400'
                          : 'text-slate-300'
                      }`}
                    >
                      <span className="text-slate-600 mr-1.5">[{log.time}]</span>
                      {log.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TAB 3: ROADMAP & IMPROVEMENT PLAN */}
        <div
          className={`w-full h-full overflow-y-auto p-4 md:p-6 max-w-5xl mx-auto flex-col gap-6 ${
            activeTab === 'roadmap' ? 'flex' : 'hidden'
          }`}
        >
          <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/40 p-5 rounded-2xl border border-purple-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-bold text-white">게임성 &amp; 그래픽 후속 개선 로드맵</h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                YouTube Shorts 및 CR(클래시 로얄) 표준 관측 기반 우선순위별 구현 가이드라인
              </p>
            </div>
            <button
              onClick={() => {
                loadFileContent('게임성-개선-방안.md');
                setActiveTab('editor');
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition"
            >
              <span>문서 편집하기</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Core Feature Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Priority 3-Star Features */}
            <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
                  <span>★★★ 최우선 게임성 고도화</span>
                </h3>
                <span className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/20 font-bold">
                  High Priority
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">엘릭서 낭비 방지 UX</span>
                    <span className="text-[10px] text-amber-400 font-mono">10/10 충전 시 펄스 경고</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    엘릭서가 10에 도달하여 넘칠 때 게이지에 골드 펄스 애니메이션과 틱 사운드를 주어 즉각적인 카드 소환 유도.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">카드 라인업 확장 (16종 목표)</span>
                    <span className="text-[10px] text-purple-400 font-mono">미니 페코 · 폭탄병 · 안개 마법</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    원작 역할군 컨벤션: 근접 딜러(단일 극딜), 폭탄병(자폭형 광역), 전술 안개 마법 등을 보강하여 덱 조합 심화.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">첫 실행 인터랙티브 튜토리얼</span>
                    <span className="text-[10px] text-emerald-400 font-mono">FSM 6단계</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    카드 선택 → 아군 진영 배치 → 첫 교전 관전 → 주문 시전 → 왕관 획득 → 수료 가이드.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">상태이상 콤보 엔진</span>
                    <span className="text-[10px] text-blue-400 font-mono">화상 · 둔화 · 기절 융합</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    화상(도트) + 둔화 + 기절(zap) 중첩 단계에 따른 증폭 효과 (2원소 +40%, 3원소 2배).
                  </p>
                </div>
              </div>
            </div>

            {/* Graphics & Feedback */}
            <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-blue-300 flex items-center gap-1.5">
                  <span>★★★ 그래픽 &amp; 전투 연출 고도화</span>
                </h3>
                <span className="text-[10px] bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/20 font-bold">
                  Visual FX
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">킬 카메라 줌 2.0배 &amp; 슬로우모션</span>
                    <span className="text-[10px] text-amber-400 font-mono">타격감 극대화</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    타워 파괴 및 보스급 유닛 킬 시 순간 슬로우모션과 카메라 줌인으로 영화 같은 피니시 연출.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">승리 연출 폭죽 &amp; 3D 왕관 파티클</span>
                    <span className="text-[10px] text-yellow-400 font-mono">결과 화면 강화</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    승리 판정 시 황금 폭죽 파티클과 왕관 낙하 연출로 승리 쾌감과 보상 수령 동기 부여.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">투사체 궤적 잔상 (Motion Trails)</span>
                    <span className="text-[10px] text-indigo-400 font-mono">아처 화살 · 마법구 트레일</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    직전 좌표 3~5개 페이드 트레일 효과로 원거리 투사체 궤적 가시성 대폭 향상.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">캔버스 배치 타일 하이라이트</span>
                    <span className="text-[10px] text-teal-400 font-mono">배치 안내 펄스 링</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    카드 드래그 시 아군 소환 가능 타일 구역 점선 회전 및 펄스 발광 가이드 표시.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TAB 4: FILE VIEWER & CODE EDITOR */}
        <div
          className={`w-full h-full overflow-hidden p-4 md:p-6 max-w-7xl mx-auto flex flex-col gap-4 ${
            activeTab === 'editor' ? 'flex' : 'hidden'
          }`}
        >
          {/* File Selector Bar */}
          <div className="bg-slate-900/95 p-3 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {files.map(f => (
                <button
                  key={f.name}
                  onClick={() => loadFileContent(f.name)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition shrink-0 ${
                    selectedFile === f.name
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <FileCode2 className="w-3.5 h-3.5" />
                  <span>{f.name}</span>
                  <span className="text-[10px] text-slate-400">
                    ({Math.round(f.size / 1024)}KB)
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {fileModified && (
                <span className="text-xs text-amber-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  수정됨 (미저장)
                </span>
              )}
              <button
                onClick={saveFileContent}
                disabled={isSavingFile || !fileModified}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-sm disabled:opacity-40"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSavingFile ? '저장 중...' : '파일 저장'}</span>
              </button>
            </div>
          </div>

          {/* Editor Container */}
          <div className="flex-1 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col relative shadow-inner">
            <div className="h-9 bg-slate-900/90 border-b border-slate-800 px-4 flex items-center justify-between text-xs text-slate-400 font-mono shrink-0">
              <span>{selectedFile}</span>
              <span>{loadingFile ? '로딩 중...' : `${fileContent.length.toLocaleString()} 글자`}</span>
            </div>

            {loadingFile ? (
              <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
                파일 내용을 불러오는 중입니다...
              </div>
            ) : (
              <textarea
                value={fileContent}
                onChange={e => {
                  setFileContent(e.target.value);
                  setFileModified(true);
                }}
                spellCheck={false}
                className="flex-1 w-full p-4 bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed focus:outline-none resize-none selection:bg-blue-600 selection:text-white"
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
