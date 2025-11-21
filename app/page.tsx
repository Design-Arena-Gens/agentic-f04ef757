'use client';

import { useState } from 'react';
import { Sparkles, RefreshCw, Copy, Check, Twitter, Linkedin, Instagram, Facebook } from 'lucide-react';

interface GeneratedContent {
  platform: string;
  content: string;
  hashtags: string[];
  bestTime: string;
}

export default function Home() {
  const [twinProfile, setTwinProfile] = useState('');
  const [contentType, setContentType] = useState('post');
  const [tone, setTone] = useState('professional');
  const [platform, setPlatform] = useState('twitter');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const platforms = [
    { id: 'twitter', name: 'Twitter/X', icon: Twitter },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin },
    { id: 'instagram', name: 'Instagram', icon: Instagram },
    { id: 'facebook', name: 'Facebook', icon: Facebook },
  ];

  const contentTypes = [
    'post',
    'announcement',
    'thought-leadership',
    'engagement',
    'story',
    'poll',
  ];

  const tones = [
    'professional',
    'casual',
    'witty',
    'inspiring',
    'educational',
    'friendly',
  ];

  const handleGenerate = async () => {
    if (!twinProfile.trim()) {
      alert('Please describe your digital twin profile');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          twinProfile,
          contentType,
          tone,
          platform,
        }),
      });

      const data = await response.json();

      if (data.error) {
        alert(data.error);
      } else {
        setGeneratedContent(data.content);
      }
    } catch (error) {
      console.error('Generation error:', error);
      alert('Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getPlatformIcon = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    if (!platform) return null;
    const Icon = platform.icon;
    return <Icon className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-purple-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI Social Content Agent
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Create custom social media content for AI digital twins and social management platforms
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Configure Your Digital Twin</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Digital Twin Profile
                </label>
                <textarea
                  value={twinProfile}
                  onChange={(e) => setTwinProfile(e.target.value)}
                  placeholder="Describe your digital twin: personality, expertise, interests, target audience..."
                  className="w-full h-32 px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Platform
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {platforms.map((p) => {
                    const Icon = p.icon;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setPlatform(p.id)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                          platform === p.id
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                            : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{p.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Content Type
                </label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  {contentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Tone
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  {tones.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !twinProfile.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Content
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Output Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Generated Content</h2>

            {generatedContent.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[500px] text-gray-400">
                <Sparkles className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-center">
                  Configure your digital twin and click Generate Content to see AI-powered social media posts
                </p>
              </div>
            ) : (
              <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                {generatedContent.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 border-2 border-purple-100 dark:border-gray-600"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {getPlatformIcon(item.platform)}
                        <span className="font-semibold text-gray-800 dark:text-white">
                          {platforms.find(p => p.id === item.platform)?.name}
                        </span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(item.content + '\n\n' + item.hashtags.join(' '), index)}
                        className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        {copiedIndex === index ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <Copy className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        )}
                      </button>
                    </div>

                    <p className="text-gray-800 dark:text-gray-200 mb-4 whitespace-pre-wrap">
                      {item.content}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {item.hashtags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Best time to post:</strong> {item.bestTime}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">AI-Powered</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Advanced AI generates authentic content that matches your digital twin's personality and voice
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
              <RefreshCw className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">Multi-Platform</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Optimized content for Twitter, LinkedIn, Instagram, and Facebook with platform-specific best practices
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center mb-4">
              <Copy className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">Ready to Use</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Copy and paste content directly to your social media management tools or platforms
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
