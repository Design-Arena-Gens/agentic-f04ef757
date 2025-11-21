import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { twinProfile, contentType, tone, platform } = await req.json();

    // Simulate AI content generation
    const generatedContent = generateContent(twinProfile, contentType, tone, platform);

    return NextResponse.json({ content: generatedContent });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}

function generateContent(
  twinProfile: string,
  contentType: string,
  tone: string,
  platform: string
) {
  // Platform-specific content generation
  const platformConfigs: Record<string, { maxLength: number; bestTime: string }> = {
    twitter: { maxLength: 280, bestTime: '12:00 PM - 3:00 PM EST (weekdays)' },
    linkedin: { maxLength: 1300, bestTime: '7:00 AM - 9:00 AM EST (weekdays)' },
    instagram: { maxLength: 2200, bestTime: '11:00 AM - 1:00 PM EST' },
    facebook: { maxLength: 5000, bestTime: '1:00 PM - 4:00 PM EST' },
  };

  const config = platformConfigs[platform] || platformConfigs.twitter;

  // Content templates based on type and tone
  const contents = [
    {
      platform,
      content: generateContentText(twinProfile, contentType, tone, platform),
      hashtags: generateHashtags(twinProfile, platform),
      bestTime: config.bestTime,
    },
  ];

  // Generate 2-3 variations
  if (platform === 'twitter') {
    contents.push({
      platform,
      content: generateContentText(twinProfile, contentType, tone, platform, 'variation'),
      hashtags: generateHashtags(twinProfile, platform),
      bestTime: config.bestTime,
    });
  }

  return contents;
}

function generateContentText(
  profile: string,
  type: string,
  tone: string,
  platform: string,
  variation?: string
): string {
  const profileKeywords = extractKeywords(profile);

  const templates: Record<string, Record<string, string[]>> = {
    post: {
      professional: [
        `Excited to share insights on ${profileKeywords[0] || 'innovation'}. In today's rapidly evolving landscape, it's crucial to stay ahead of the curve.\n\nKey takeaways:\n• ${profileKeywords[1] || 'Strategy'} drives success\n• ${profileKeywords[2] || 'Adaptation'} is essential\n• Continuous learning is paramount`,
        `Reflecting on the importance of ${profileKeywords[0] || 'growth'} in our field. The intersection of ${profileKeywords[1] || 'technology'} and ${profileKeywords[2] || 'innovation'} continues to reshape how we approach challenges.`,
      ],
      casual: [
        `Just thinking about ${profileKeywords[0] || 'cool stuff'} today! 🚀\n\nIt's amazing how ${profileKeywords[1] || 'things'} are evolving. Can't wait to see what comes next!`,
        `Hot take: ${profileKeywords[0] || 'Innovation'} is moving faster than ever. Who else is excited about where ${profileKeywords[1] || 'the future'} is heading? 🔥`,
      ],
      witty: [
        `Plot twist: ${profileKeywords[0] || 'Success'} isn't just about working harder, it's about working smarter. And maybe drinking more coffee ☕\n\nThoughts on ${profileKeywords[1] || 'productivity'}?`,
        `Remember when ${profileKeywords[0] || 'things'} used to be simple? Yeah, me neither. 😄\n\nBut seriously, ${profileKeywords[1] || 'evolution'} is what keeps us growing.`,
      ],
      inspiring: [
        `Every challenge is an opportunity in disguise. 🌟\n\nWhen ${profileKeywords[0] || 'obstacles'} arise, remember: you're stronger than you think. Keep pushing forward.\n\n${profileKeywords[1] || 'Success'} starts with believing in yourself.`,
        `Your journey with ${profileKeywords[0] || 'growth'} is unique. Don't compare your chapter 1 to someone else's chapter 20.\n\nKeep going. You've got this! 💪`,
      ],
      educational: [
        `📚 Let's talk about ${profileKeywords[0] || 'key concepts'}:\n\n1️⃣ Understanding ${profileKeywords[1] || 'fundamentals'} is crucial\n2️⃣ Application matters more than theory\n3️⃣ Continuous improvement drives results\n\nWhat's your experience with this?`,
        `Quick lesson on ${profileKeywords[0] || 'best practices'}:\n\n✓ Start with ${profileKeywords[1] || 'basics'}\n✓ Build systematically\n✓ Learn from failures\n\nThe journey is just as important as the destination.`,
      ],
      friendly: [
        `Hey everyone! 👋\n\nJust wanted to share some thoughts on ${profileKeywords[0] || 'interesting topics'}. What's everyone working on this week?\n\nAlways love hearing about your ${profileKeywords[1] || 'projects'}!`,
        `Happy to connect with all of you! Been exploring ${profileKeywords[0] || 'new ideas'} lately and would love to hear your perspectives.\n\nHow's everyone doing? 😊`,
      ],
    },
    announcement: {
      professional: [
        `📢 Important Update\n\nExcited to announce ${profileKeywords[0] || 'new developments'} in ${profileKeywords[1] || 'our journey'}. This milestone represents a significant step forward.\n\nStay tuned for more details!`,
      ],
      casual: [
        `Big news, everyone! 🎉\n\nWe're launching something special around ${profileKeywords[0] || 'innovation'}. Can't wait to share more!\n\nGet ready for ${profileKeywords[1] || 'awesome things'}!`,
      ],
    },
    'thought-leadership': {
      professional: [
        `The future of ${profileKeywords[0] || 'our industry'} is being shaped today. Here's what leaders need to consider:\n\n🔹 ${profileKeywords[1] || 'Innovation'} velocity is accelerating\n🔹 ${profileKeywords[2] || 'Adaptability'} separates winners from losers\n🔹 Values-driven approaches create lasting impact\n\nWhat trends are you watching?`,
      ],
      inspiring: [
        `True leadership isn't about being in charge—it's about taking care of those in your charge.\n\nIn the realm of ${profileKeywords[0] || 'innovation'}, the best leaders:\n✨ Empower others\n✨ Embrace ${profileKeywords[1] || 'change'}\n✨ Lead with authenticity`,
      ],
    },
    engagement: {
      friendly: [
        `Quick question for the community! 🤔\n\nWhat's your take on ${profileKeywords[0] || 'current trends'}? I'm curious to hear different perspectives on ${profileKeywords[1] || 'this topic'}.\n\nDrop your thoughts below! 👇`,
      ],
      casual: [
        `Alright, let's settle this debate: ${profileKeywords[0] || 'Option A'} or ${profileKeywords[1] || 'Option B'}?\n\nDrop a comment with your choice and why! 💭`,
      ],
    },
    story: {
      inspiring: [
        `A year ago, I was navigating challenges with ${profileKeywords[0] || 'my journey'}. Today, looking back, every obstacle was a stepping stone.\n\nThe lesson? ${profileKeywords[1] || 'Persistence'} pays off. Keep going, even when it's tough. Your breakthrough is closer than you think. 🌟`,
      ],
      casual: [
        `Storytime! 📖\n\nSo there I was, dealing with ${profileKeywords[0] || 'an interesting situation'}... and you won't believe what happened next.\n\nLet's just say ${profileKeywords[1] || 'lessons'} were learned! 😅`,
      ],
    },
    poll: {
      engaging: [
        `🗳️ Quick Poll Time!\n\nWhen it comes to ${profileKeywords[0] || 'success'}, which matters most?\n\nA) ${profileKeywords[1] || 'Strategy'}\nB) Execution\nC) Timing\nD) All of the above\n\nVote and share your reasoning! 👇`,
      ],
    },
  };

  const toneTemplates = templates[type]?.[tone] || templates.post[tone] || templates.post.professional;
  const templateIndex = variation ? 1 % toneTemplates.length : 0;

  return toneTemplates[templateIndex] || toneTemplates[0];
}

function generateHashtags(profile: string, platform: string): string[] {
  const keywords = extractKeywords(profile);

  const baseHashtags: Record<string, string[]> = {
    twitter: ['#AI', '#Innovation', '#Tech', '#DigitalTransformation', '#Leadership'],
    linkedin: ['#Innovation', '#Leadership', '#ProfessionalGrowth', '#BusinessStrategy', '#FutureOfWork'],
    instagram: ['#Inspiration', '#Growth', '#Success', '#Motivation', '#Innovation'],
    facebook: ['#Community', '#Growth', '#Innovation', '#Success', '#Learning'],
  };

  const platformHashtags = baseHashtags[platform] || baseHashtags.twitter;

  // Blend profile-specific and platform hashtags
  const customHashtags = keywords.slice(0, 2).map(k => `#${k.replace(/\s+/g, '')}`);

  return [...customHashtags, ...platformHashtags.slice(0, 3)].slice(0, 5);
}

function extractKeywords(text: string): string[] {
  // Simple keyword extraction
  const words = text.toLowerCase().split(/\s+/);
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);

  const keywords = words
    .filter(word => word.length > 4 && !stopWords.has(word))
    .filter(word => /^[a-z]+$/.test(word));

  // Return unique keywords, capitalized
  const unique = Array.from(new Set(keywords));
  return unique.slice(0, 5).map(word => word.charAt(0).toUpperCase() + word.slice(1));
}
