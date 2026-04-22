import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@clerk/react';
import { getSupabaseClient } from './supabaseClient';
import { useSync } from './hooks/useSync'; // The helper we discussed
const objections = [
  {
    id: 1,
    category: 'Price',
    icon: '💰',
    objection: "It's too expensive. I can't afford it right now.",
    psychology:
      "The prospect is prioritizing immediate comfort over future security. They're comparing the premium to something tangible they could buy today.",
    response:
      "I completely understand — nobody wants another bill. But let me ask you this: what would happen to your family's mortgage, your kids' school, or your spouse's income if something happened to you tomorrow? The average cup of coffee costs more per day than what this coverage runs. We're not talking about an expense — we're talking about replacing your income permanently. That's not a cost, that's a guarantee.",
    followup:
      "If they push back: 'What would be a comfortable number for you?' Then work backward from there — there's almost always a policy that fits. Offer a smaller face value to start.",
  },
  {
    id: 2,
    category: 'Price',
    icon: '📈',
    objection: "I'd rather invest that money than pay premiums.",
    psychology:
      'A financially savvy objection. The prospect sees premiums as dead money and is comparing insurance to an investment vehicle without understanding the risk gap.',
    response:
      "That's a sharp way of thinking about money, and I respect it. But here's the problem with that math: investing only works if you're alive long enough to let it grow. If something happens to you in year two, your family doesn't get your portfolio — they get whatever you managed to save in 24 months. Life insurance isn't instead of investing. It's what protects your ability to keep investing. It's the foundation, not the alternative.",
    followup:
      "For the right prospect, pivot to whole life or IUL: 'There are policies that actually build cash value over time — so you're doing both. Want me to show you how that works?'",
  },
  {
    id: 3,
    category: 'Price',
    icon: '💻',
    objection: 'I can get a cheaper policy online.',
    psychology:
      "They've done some homework. The price comparison is real, but they may not be comparing equivalent coverage. The differentiator is service, trust, and guidance.",
    response:
      "You absolutely can, and some of those are legitimate options. But here's what you're trading when you go direct: there's no one reviewing your application to make sure it's filled out correctly, no one advocating for you if a claim gets complicated, and no one to call when your situation changes. I've seen families get denied claims because of a paperwork error nobody caught. What I provide isn't just the policy — it's someone in your corner for the life of that policy.",
    followup:
      "Offer to match or beat the online quote: 'Tell me what you found and I'll run it against what I have access to. If they're genuinely better, I'll tell you honestly.'",
  },
  {
    id: 4,
    category: 'Price',
    icon: '🧾',
    objection: 'I have too many bills right now. Maybe next year.',
    psychology:
      "They're telling you it's a budget issue, but 'next year' rarely comes. The real question is whether they see it as a priority.",
    response:
      "I hear you — bills are real and budgets are tight. But here's the thing: next year your bills won't disappear, and your rates won't go down. What will change is your age and possibly your health, both of which increase what you pay. What I want to do is find something that fits today's budget — even if it's a smaller policy to start — so that you're protected right now and can build on it later.",
    followup:
      "Ask: 'If I could show you something under $30 a month, would that change things?' Almost everyone can find $30. Start there and build the relationship.",
  },
  {
    id: 5,
    category: 'Price',
    icon: '✂️',
    objection: 'Can we lower the coverage amount to bring the price down?',
    psychology:
      "This is actually a buying signal. They want it — they're negotiating. Work with them, but make sure they understand what they're trading.",
    response:
      "Absolutely, we can do that — and I appreciate that you're trying to make this work. Before we adjust the number, let me just show you what the difference looks like so you can make a fully informed call. Dropping from $500k to $300k saves you about $X per month, but the payout gap is $200,000 to your family. Sometimes it makes sense; sometimes when people see it laid out, they find a way to keep the full amount. Your call — I just want you to see it clearly.",
    followup:
      "Always run the math out loud so they can hear the trade-off. Then ask: 'Given that, what feels right?' Let them decide with full information.",
  },
  {
    id: 6,
    category: 'Delay',
    icon: '⏳',
    objection: 'I need to think about it.',
    psychology:
      "Usually a polite way of saying they're not fully convinced yet, or they're uncomfortable making decisions under perceived pressure. They want an escape hatch.",
    response:
      "Absolutely, and I respect that. But can I ask — what specifically do you want to think about? Because if there's a concern I haven't addressed, I'd rather talk through it now than have you carry that unanswered question. The one thing I can tell you is that we're all one health event away from becoming uninsurable. The best time to lock in your rate is today when you're healthy.",
    followup:
      "If they go quiet: 'Is it the monthly amount, the coverage, or something else entirely?' Narrowing it down moves the conversation forward.",
  },
  {
    id: 7,
    category: 'Delay',
    icon: '📩',
    objection: 'Can you just send me some information to look over?',
    psychology:
      'A classic soft exit. They want to end the conversation without saying no. Information rarely closes deals — conversations do.',
    response:
      "Of course, I can absolutely send you something. But I want to make sure what I send is actually relevant to you — not just a generic brochure. Can I ask you two quick questions so I know exactly what to put together? Perfect — I'll customize something specifically for your situation. And honestly, most of the important stuff we've already covered. Is there one thing that's still a question mark for you right now?",
    followup:
      "Always follow up sent materials with a scheduled callback — not 'I'll check in,' but a specific time: 'I'll call you Thursday at 2pm — does that work?'",
  },
  {
    id: 8,
    category: 'Delay',
    icon: '📅',
    objection: "This isn't a good time. Call me back in a few months.",
    psychology:
      "Vague future = polite no. 'A few months' is rarely a real timeline — it's a hope that you'll go away. The goal is to find out if there's a real reason or just discomfort.",
    response:
      "Absolutely, I can do that. But I want to be straight with you — I've made a lot of those callbacks, and more often than not, 'a few months' turns into a year, and by then something has changed: a health event, a rate increase, life getting in the way. What's happening in a few months that would make this a better time? If there's a real reason, I want to respect it. If it's just feeling rushed today, we can take this slower right now.",
    followup:
      "If they give a real reason (job change, new baby, moving), work WITH it: 'That actually makes this the perfect time to lock something in before that transition.'",
  },
  {
    id: 9,
    category: 'Delay',
    icon: '🔁',
    objection: "I've been meaning to do this for years. I'll get to it.",
    psychology:
      "They know they need it — they've been avoiding the decision, not the product. This is procrastination, not objection. Make it easy and immediate.",
    response:
      "You know what, that's actually the most honest thing anyone has said to me today. And I think you already know what I'm about to say — every year you've waited, your rate has gone up and your window has gotten a little smaller. The version of you from five years ago would be really glad if today's version finally did this. What would it take to check this off the list today?",
    followup:
      "Use a sense of completion rather than urgency: 'Let's get this done so you never have to have this on your mental list again.' People respond to closure.",
  },
  {
    id: 10,
    category: 'Delay',
    icon: '🎄',
    objection: "It's a bad time — holidays, tax season, busy with work…",
    psychology:
      "There's always a season or event that feels like the wrong time. This is displacement — the real issue is prioritization, not timing.",
    response:
      "I get it — life is always happening. But here's a thought: most people get their biggest financial wake-up calls during those exact moments — tax season, new year, end of year. Your income is on your mind right now. Your family's security is on your mind right now. This conversation fits perfectly in this moment. It doesn't take long, and then it's done — no matter what season it is.",
    followup:
      "Offer a 15-minute 'just the basics' version: 'We don't have to do everything today. Let me just get the key numbers locked in, and we can finish the paperwork when things calm down.'",
  },
  {
    id: 11,
    category: 'Spouse',
    icon: '👥',
    objection: 'I need to talk to my spouse first.',
    psychology:
      'This is often genuine — and valid. But it can also be a delay tactic. Either way, the right move is to validate it and try to get the spouse involved immediately.',
    response:
      "That makes total sense — this is a family decision and your spouse absolutely should be part of it. In fact, I'd love to include them. Is there any chance we could get them on the phone right now, even just for 10 minutes? That way you both hear the same information and can decide together. That's actually how the best decisions get made.",
    followup:
      "If they can't get the spouse: 'What do you think their main concern would be?' Then address that concern directly — you're essentially pre-handling the spouse's objection.",
  },
  {
    id: 12,
    category: 'Spouse',
    icon: '💑',
    objection: "My spouse handles all the finances. I'd have to ask them.",
    psychology:
      "This can be genuine OR a deflection. Either way, the goal is the same: get the decision-maker in the room. Don't try to close the non-financial spouse alone.",
    response:
      "That makes complete sense — and honestly, this is a decision your spouse should be part of anyway. You'd be doing them a favor by looping them in now rather than later. Is there a time today or tomorrow when the two of you could sit down together for 20 minutes? I can walk you both through it at the same time, answer all the questions once, and you can decide together.",
    followup:
      'If they agree to a joint meeting, send a simple 1-page summary they can share with their spouse before the call so the spouse arrives informed, not cold.',
  },
  {
    id: 13,
    category: 'Spouse',
    icon: '🤝',
    objection: 'My spouse thinks insurance is a waste of money.',
    psychology:
      "You have an invisible objector in the room. The prospect may personally agree with you but won't go against their partner. You need to arm your prospect to handle their spouse.",
    response:
      "That's actually more common than you'd think, and it usually comes from not seeing how the math works. Here's what I'd suggest — let me send you one simple page that shows exactly what happens financially without coverage versus with it. Most spouses, when they see the actual numbers, change their mind pretty quickly. You don't have to sell them — just show them the math. Would that help?",
    followup:
      'Create a simple leave-behind specifically designed for skeptical spouses. Numbers, not emotion. A chart showing income replacement vs. savings depletion is usually all it takes.',
  },
  {
    id: 14,
    category: 'Spouse',
    icon: '👶',
    objection: "We just had a baby. We can't take on any new expenses.",
    psychology:
      'Ironic objection — a new baby is the strongest reason to get covered. Reframe gently without being tone-deaf to the genuine financial pressure.',
    response:
      "Congratulations — that's wonderful news. And I completely understand the timing feels tight. But I have to be honest with you: having a baby is actually the single biggest reason people get this done. You just became someone's everything. The question isn't whether you can afford it right now — it's whether your family can afford not to have it. Let me show you what a starter policy looks like — something that protects your child's future without breaking your new budget.",
    followup:
      'Lead with the smallest viable policy. A $250k 20-year term for a new parent is often under $25/month. That number changes the conversation.',
  },
  {
    id: 15,
    category: 'Trust',
    icon: '🏢',
    objection: "I already have coverage through work. I'm good.",
    psychology:
      "The prospect feels covered and sees no urgency. They don't realize group coverage is tied to employment and usually inadequate.",
    response:
      "That's actually really common, and I'm glad you have something. But here's what most people don't realize about employer coverage — the moment you leave that job, get laid off, or the company changes its benefits, that policy disappears. It's not yours. And most group plans only cover one to two times your salary, which might sound like a lot until you calculate what your family actually needs for 20 or 30 years. What we're building here is yours — it goes where you go.",
    followup:
      "Ask: 'Do you know exactly how much coverage your employer provides and what happens to it if you change jobs?' Most people don't — and that opens the conversation.",
  },
  {
    id: 16,
    category: 'Trust',
    icon: '💔',
    objection: "I've had a bad experience with insurance before.",
    psychology:
      "There's an emotional wound here. Logic won't fix it — empathy opens the door, then facts walk through it. Don't get defensive about the industry.",
    response:
      "I'm really sorry to hear that — and honestly, that kind of experience shouldn't happen. Tell me what happened, if you don't mind. I want to understand what went wrong, because a bad experience usually comes down to either the wrong product, the wrong carrier, or an agent who wasn't looking out for you. My job is to make sure none of those things happen here. I'd rather spend an extra hour getting this right than rush you into something that doesn't serve you.",
    followup:
      "Listen fully before responding. Then: 'Based on what you're describing, here's what I would have done differently...' Show them you understand the mistake and how you avoid it.",
  },
  {
    id: 17,
    category: 'Trust',
    icon: '🧐',
    objection:
      "I don't trust financial products. They're always full of hidden fees.",
    psychology:
      'Financial trauma or media influence is driving this. They need radical transparency — show every number, explain every term.',
    response:
      "That skepticism is earned — a lot of financial products ARE complicated and full of small print. That's exactly why I'm going to walk you through every single line of this policy before you sign anything. I want you to understand what you're buying, what it costs, what it pays, and under what conditions. If I can't explain something clearly, that's a red flag we should both pay attention to. Transparency isn't just nice to have — it's how I do business.",
    followup:
      'Slow down and over-explain. Use plain language. Offer to email a plain-English summary before any paperwork. Prospects who need transparency reward agents who give it with loyalty.',
  },
  {
    id: 18,
    category: 'Skepticism',
    icon: '🛡️',
    objection: "Insurance companies never pay out. It's a scam.",
    psychology:
      'A deeply held distrust, often from a personal experience or story they heard. They need facts and emotional reframing.',
    response:
      "I hear that a lot, and honestly, it's a fair concern given some of the horror stories out there. But here's the reality: the life insurance industry pays out over $700 billion in claims every year. The cases where claims get denied are almost always due to non-disclosure — someone left something off their application. That's exactly why I walk through everything with you carefully. My job is to make sure this policy pays exactly when your family needs it most. No surprises.",
    followup:
      'Share a brief, real story (with no names) of a claim you know was paid. Personal evidence is more powerful than statistics alone.',
  },
  {
    id: 19,
    category: 'Skepticism',
    icon: '🤨',
    objection: "You're just trying to make a commission.",
    psychology:
      "A trust attack — and sometimes a test to see how you respond under pressure. Don't get defensive. Acknowledge it directly and flip it.",
    response:
      "You're right, I do earn a commission — I'm not going to pretend otherwise. But here's the thing: I only earn that commission if I put you in the right policy, because my business runs on referrals. If I sell you something that doesn't fit and you cancel in six months, I don't just lose the commission — I lose your trust and everyone you know. My income depends on doing right by you. That actually puts us on the same side.",
    followup:
      "Follow with: 'What would make you feel confident that what I'm recommending is genuinely the right fit for you?' Then actually do whatever they say.",
  },
  {
    id: 20,
    category: 'Skepticism',
    icon: '📰',
    objection: "I've heard life insurance is just a bad deal financially.",
    psychology:
      "They've read something or heard a podcast that dismissed insurance. You're fighting secondhand information.",
    response:
      "I've heard that take, and it usually comes from a very specific argument — buy term and invest the rest — which is actually solid advice in the right situation. But here's what it doesn't account for: what happens in the 10 years before your investments grow large enough to self-insure? That's the gap. And for most people in their 30s and 40s, that gap is enormous. The 'bad deal' math only works if you live long enough for it to work — and none of us can guarantee that.",
    followup:
      "Ask: 'Where did you hear that?' Understanding their source helps you address the specific argument they're holding onto.",
  },
  {
    id: 21,
    category: 'Skepticism',
    icon: '🏛️',
    objection: "I've heard insurance companies go bankrupt. What if mine does?",
    psychology:
      'A legitimate concern that most agents never address. Having the answer builds massive credibility.',
    response:
      "That's actually a really smart question and most agents never address it. Every state has a guaranty association that protects policyholders if an insurer becomes insolvent — typically up to $300,000 in death benefits, sometimes more. Beyond that, I only work with A-rated or better carriers, meaning they have the financial strength ratings to back up their promises. I can show you the rating for any carrier I recommend before we go any further.",
    followup:
      "Pull up the carrier's AM Best or Moody's rating on the spot. Showing the rating in real time is far more powerful than just describing it.",
  },
  {
    id: 22,
    category: 'Urgency',
    icon: '⚡',
    objection: "I'm young and healthy. I don't need it yet.",
    psychology:
      "Youth creates a false sense of invincibility. The prospect doesn't understand that youth is exactly why NOW is the best time.",
    response:
      "You just made the best argument FOR doing this today. The fact that you're young and healthy is exactly why your rates right now are the lowest they will ever be in your life. Every year you wait, that number goes up. I've had clients come back to me three years later wanting the same policy — and it cost them 40% more because they had a minor health issue in between. You're essentially getting a discount right now just for being you.",
    followup:
      "Use a simple number: 'A healthy 28-year-old pays roughly [X] a month for $500k in coverage. At 35 with one health flag on your record, that same policy is [Y]. Want to lock in the lower number today?'",
  },
  {
    id: 23,
    category: 'Urgency',
    icon: '🌱',
    objection:
      "My parents are still alive. I'll get it when I actually need it.",
    psychology:
      "The prospect is using their parents' health as a proxy for their own mortality. They think 'need' equals old age.",
    response:
      "That's actually a really common way to think about it, and I get it. But life insurance isn't about being old — it's about having people who depend on you. Do you have a mortgage? A partner? Kids, or plans for them? Those are the years this matters most. And here's the thing: by the time you feel like you 'need' it, you may not qualify for it at the rate you'd want.",
    followup:
      "Ask: 'If something happened to you tomorrow, who would be most affected financially?' That question lands differently than any statistic.",
  },
  {
    id: 24,
    category: 'Urgency',
    icon: '🏃',
    objection: "I'm in great shape. I exercise and eat well. I'm not a risk.",
    psychology:
      'The prospect conflates health habits with immunity from accidents, cancer, and other non-lifestyle causes of death.',
    response:
      "I love that — seriously, it means you'll get the best rates possible. But I want to share something: the majority of life insurance claims aren't from lifestyle diseases. They're from accidents, cancer that nobody saw coming, sudden cardiac events in people who ran marathons. Being healthy earns you the best price. It doesn't remove the need. You're just in the best position to lock in a great deal right now.",
    followup:
      'Share a real-world example of someone unexpected — a 35-year-old runner, a non-smoker — who passed away and the family was left unprepared. Real stories cut through statistical thinking.',
  },
  {
    id: 25,
    category: 'Health',
    icon: '🏥',
    objection: "I have some health issues. I probably won't even qualify.",
    psychology:
      "The prospect has pre-rejected themselves. They're protecting their ego from a potential rejection. Most people don't know how forgiving modern underwriting actually is.",
    response:
      "I hear that a lot, and I want to challenge that assumption — because most people who say that end up qualifying for something meaningful. Underwriting has evolved a lot. Conditions like high blood pressure, diabetes, even some past surgeries don't automatically disqualify you. The worst that happens is we find out exactly where you stand, and that costs you nothing. Let me run your information and see what comes back — you might be surprised.",
    followup:
      "If they're still hesitant: 'There are also guaranteed issue policies that don't require medical underwriting at all. The payout may be smaller, but it's real coverage. Want me to show you what that looks like?'",
  },
  {
    id: 26,
    category: 'Health',
    icon: '🚬',
    objection: "I smoke. Won't that make it impossible to afford?",
    psychology:
      "They know smoking affects rates and are pre-disqualifying themselves. Rates for smokers are higher but not impossible — and there's a path to standard rates.",
    response:
      "Smoking does affect your rates, I won't pretend otherwise. But 'impossible to afford' — that's not accurate. There are carriers that specialize in smoker underwriting, and the rates are higher but very real. And here's the thing: if you quit for 12 months, many carriers will reclassify you at non-smoker rates. So we can either get you covered now at smoker rates and revisit in a year, or I can show you both numbers side by side so you can decide.",
    followup:
      'Always offer the side-by-side comparison. Seeing the dollar savings from quitting can itself be motivating. You become a partner in their health, not just a salesperson.',
  },
  {
    id: 27,
    category: 'Health',
    icon: '⚖️',
    objection: "I'm overweight. I figured I'd wait until I lose some weight.",
    psychology:
      "They're using a future health goal as a reason to delay. Gently challenge whether that goal will realistically happen on a timeline that matters.",
    response:
      "I appreciate you being upfront about that. Here's the honest truth: most carriers have BMI guidelines, but many are more flexible than people think. I'd rather run your actual numbers than assume. And if rates come back higher than we'd like, here's the question: is waiting really going to help? If it takes a year or two to hit that goal, that's a year or two with no coverage at all. Sometimes getting something in place now, even at a slightly higher rate, is the right call.",
    followup:
      "Offer a plan: 'Let's get you covered now. When you reach your goal weight, we apply for a policy review and potentially get your rate reduced. Best of both worlds.'",
  },
  {
    id: 28,
    category: 'Health',
    icon: '💊',
    objection: "I'm on medication. Does that automatically disqualify me?",
    psychology:
      "Another form of self-rejection. Medications alone rarely disqualify — it's the underlying condition that matters, and even that is often manageable.",
    response:
      "Not at all — and this is one of the most common misconceptions I run into. Being on medication for a managed condition is very different from having an uncontrolled one. A lot of carriers actually view well-managed conditions positively because it means you're taking care of yourself. The underwriters look at the whole picture: how long you've been on medication, how well the condition is controlled, your overall health history. Let me run your specific situation — the answer might genuinely surprise you.",
    followup:
      "Never make assumptions about what will or won't qualify. Run the case and let the underwriters decide. Your job is to submit, not to pre-screen on their behalf.",
  },
  {
    id: 29,
    category: 'No Need',
    icon: '🎯',
    objection: "I don't have anyone depending on me.",
    psychology:
      "The prospect doesn't see personal relevance. The angle shifts from family protection to personal legacy and financial planning.",
    response:
      "That's actually one of the most interesting situations to be in, because you have total flexibility. Some people use it to leave something behind for a sibling, a parent, a close friend, or even a charity they care about. Others use it as a wealth-building tool — certain policies build cash value over time you can access while you're alive. And no dependents now doesn't mean no dependents in five years. Locking in your insurability today is one of the smartest financial moves you can make.",
    followup:
      "Ask: 'Is there anyone in your life — parent, sibling, friend — who would be impacted if something happened to you?' There's almost always someone.",
  },
  {
    id: 30,
    category: 'No Need',
    icon: '🏦',
    objection: 'I already have savings. My family would be fine.',
    psychology:
      "The prospect believes their savings is a substitute for insurance. They haven't done the math on how quickly savings disappear without income replacement.",
    response:
      "That's actually a great position to be in — it means you probably need less coverage than someone starting from zero. But let me ask: how long would your savings last if your income stopped tomorrow? Most financial planners say you need 10 to 15 times your annual income to truly self-insure. If you have that, you might not need much. If you're not quite there yet, insurance fills that gap while your savings keeps growing. It's not either/or.",
    followup:
      "Walk them through a quick calculation: 'Your family needs roughly $X per year. Over 20 years, that's $Y. How close are your savings to that number?' Let the math speak.",
  },
  {
    id: 31,
    category: 'No Need',
    icon: '🧓',
    objection: "I'm almost retired. It's too late for this.",
    psychology:
      'They believe life insurance is only for younger people. Final expense coverage and legacy planning are real use cases for older prospects.',
    response:
      "It's actually not too late — the goal just shifts a little. At this stage, it's less about income replacement and more about final expenses, estate planning, and leaving something behind. The average funeral costs $10,000 to $15,000 or more. Medical bills, estate taxes, a gift to your kids or grandkids — there are really meaningful things a policy can do right now. And depending on your health, we may have more options than you'd think.",
    followup:
      'Pivot to final expense or guaranteed issue products. These are designed exactly for this demographic. Having a specific product to present makes this concrete, not abstract.',
  },
  {
    id: 32,
    category: 'No Need',
    icon: '🏠',
    objection: "My house is paid off. I don't have any debt.",
    psychology:
      "They see insurance as debt protection only and don't see the income replacement or legacy angle.",
    response:
      "That's a genuinely strong financial position — congratulations. But here's the question that matters: if you weren't here, would your family's life change financially? Even without a mortgage, there's property tax, maintenance, utilities, living expenses. If your income disappears, so does the funding for everything else. This isn't about covering debt — it's about making sure the life you've built for them keeps running.",
    followup:
      "Ask: 'What does your family's monthly cost of living look like, not counting any debt payments?' That number usually opens their eyes to what they'd actually need.",
  },
  {
    id: 33,
    category: 'Confusion',
    icon: '🧩',
    objection: "I don't understand all this. It's too complicated.",
    psychology:
      "Confusion kills sales. The prospect is overwhelmed and retreating. Simplify immediately — don't explain more, explain less.",
    response:
      "You know what? That's on me — let me strip it all the way down. Forget the policy names and the riders for a second. Here's all that really matters: if something happens to you, does your family keep their home, their lifestyle, and their future? That's what this does. Everything else is just details we can sort out together. I just need one number from you — what monthly amount would feel completely comfortable?",
    followup:
      "Draw it on paper if you're in person. A simple diagram: You → Premium → Company → Family. Visual simplicity closes more than any explanation.",
  },
  {
    id: 34,
    category: 'Confusion',
    icon: '📘',
    objection:
      "What's the difference between term and whole life? I don't know what I need.",
    psychology:
      'Genuine confusion — not resistance. The prospect wants to make a good decision but feels unequipped. This is a warm objection.',
    response:
      "Great question — let me give you the 30-second version. Term life is like renting coverage: you pay for a set number of years, it's affordable, and it covers you during your highest-risk window — while you have a mortgage, kids at home, debts. Whole life is like owning: it costs more, but it builds cash value and never expires. For most people starting out, term is the smart move. It gives you the most protection for the lowest cost right now.",
    followup:
      "Ask: 'What's your main goal right now — protecting your income, covering debts, or building something long-term?' Their answer tells you exactly which direction to go.",
  },
  {
    id: 35,
    category: 'Confusion',
    icon: '📋',
    objection: 'There are so many options. How do I know which one is right?',
    psychology:
      'Decision fatigue — too many choices causes paralysis. The prospect needs you to be a guide, not a menu. Narrow it down to two options maximum.',
    response:
      "Totally understandable — and honestly, that's why you need someone like me rather than going online and getting overwhelmed. Here's how I approach it: I ask you five questions about your life, your family, and your budget, and I narrow it down to the one or two options that actually fit. You don't need to understand every product on the market — you just need to understand the one that's right for you. Can I ask you those questions?",
    followup:
      'Never present more than two options to a confused prospect. Present the one you recommend and one alternative. More than that and you lose them.',
  },
  {
    id: 36,
    category: 'Confusion',
    icon: '🔢',
    objection: 'How do I know how much coverage I actually need?',
    psychology:
      "This is a research question, not a resistance question. They're engaging — give them a simple formula and guide them through it.",
    response:
      "Great question and there's actually a simple formula. Take your annual income, multiply it by 10 to 15, then add your outstanding debts — mortgage, car loans, any big financial obligations. That gives you a solid baseline. For most families, it lands somewhere between $500k and $1.5 million. We can refine it based on your specific situation, but that number is a great place to start. Want me to run it with your numbers right now?",
    followup:
      'Do the math with them in real time. Pull out a calculator or write it down. Active participation in the calculation creates ownership of the number.',
  },
  {
    id: 37,
    category: 'Comparison',
    icon: '🔍',
    objection: 'I want to shop around and compare prices.',
    psychology:
      "The prospect is price-anchoring. They want to feel like they're getting the best deal. The goal is to reframe value over price.",
    response:
      "Absolutely, and you should — that's smart. But here's something most people don't know: life insurance rates are regulated, so the base price for the same coverage is actually very similar across most carriers. What differs is the underwriting, the claims process, and who's actually servicing your policy. What I offer isn't just a policy — it's someone who knows your file and will be on the phone for you when it matters most. That's not something you can comparison shop.",
    followup:
      "Offer to do the comparison FOR them: 'I can run quotes from multiple carriers right now and show you side by side. That way you get the shopping done here without the sales calls from five other agents.'",
  },
  {
    id: 38,
    category: 'Comparison',
    icon: '🤖',
    objection: 'I was going to look at one of those insurance comparison apps.',
    psychology:
      "The prospect wants efficiency and control. They're not opposed to buying — they just want to feel like they did their due diligence.",
    response:
      "Those apps are useful for getting a ballpark number, and I'd actually encourage you to use one — it helps you understand the market. But here's the gap: those apps give you quotes based on the information you enter, and they can't ask follow-up questions, catch underwriting flags, or advocate for you when something comes back unexpectedly. I can do all of that. Use the app to get a number, then call me and I'll either match it or explain why what I have is worth the difference.",
    followup:
      "Position yourself as the expert layer on top of the tech. You're not threatened by the app — you're better than it in the ways that actually matter.",
  },
  {
    id: 39,
    category: 'Comparison',
    icon: '🏦',
    objection: "My bank offers life insurance. I'll just get it through them.",
    psychology:
      'Convenience play — they want to bundle with an existing relationship. Bank life insurance tends to be overpriced and under-explained.',
    response:
      "That's convenient, and I get the appeal of keeping everything in one place. But bank-offered life insurance is almost always more expensive than what you can get through a licensed specialist, and the coverage options are usually more limited. Banks make their money on loans and accounts — insurance is an add-on for them. For me, this is the whole job. I can usually find you better coverage for less than what your bank is quoting. Want me to run a quick comparison?",
    followup:
      "If they're committed to the bank relationship, ask: 'What are they quoting you?' Then come in lower. Even a small savings feels like a win and shifts their loyalty.",
  },
  {
    id: 40,
    category: 'Comparison',
    icon: '🤝',
    objection:
      'A friend of mine is also an insurance agent. I should probably use them.',
    psychology:
      "Loyalty objection — personal relationship is valued over professional outcome. Don't attack the friend.",
    response:
      "That's completely fair — loyalty matters. But I want to ask you something: when your friend processes your application and reviews your file, can they give you truly objective advice, or is there an awkwardness that comes with the personal relationship? Sometimes the best person to handle sensitive financial decisions is someone professional but outside your inner circle. That said, if you decide to go with your friend, I completely understand. I just want to make sure you're getting the best policy, not just the most comfortable one.",
    followup:
      "If they're firm on the friend, wish them well and ask to be their backup: 'If it doesn't work out or you want a second opinion, please call me.' Graciousness earns referrals even from people who don't buy.",
  },
  {
    id: 41,
    category: 'Process',
    icon: '🩺',
    objection: "I don't want to do a medical exam.",
    psychology:
      "Convenience objection. They don't want the hassle, discomfort, or potential bad news of a formal exam.",
    response:
      "Good news — you don't have to. There are fully underwritten no-exam policies from major carriers that just require answering health questions. You can apply from your phone or computer and get a decision in minutes to a few days. The rates are very close to exam-based policies, and you skip the whole process entirely. For most healthy people, this is actually the better option anyway. Want me to run you a no-exam quote right now?",
    followup:
      'Lead with no-exam options whenever possible for this objection. Even if the rate is slightly higher, closing a no-exam sale beats losing a sale over a medical exam.',
  },
  {
    id: 42,
    category: 'Process',
    icon: '🐌',
    objection: 'The application process seems really long and complicated.',
    psychology:
      "They've heard horror stories or started the process elsewhere and gave up. Simplify and demystify the process step by step.",
    response:
      "I completely understand that fear — and honestly, a lot of insurance companies make it way harder than it needs to be. With the way I work, most applications take about 20 to 30 minutes. I fill out most of it for you based on our conversation, you review and sign, and then we wait for underwriting — which for many policies comes back in days, not weeks. I'll walk you through every step and you'll never feel like you don't know where you are in the process.",
    followup:
      "Set expectations with a simple timeline: 'Here's what happens after we submit: Day 1-3 is underwriting review, Day 3-7 you get the decision, and by Day 10 you're covered.' Concrete timelines reduce anxiety.",
  },
  {
    id: 43,
    category: 'Process',
    icon: '🔒',
    objection: "I'm worried about sharing my personal and medical information.",
    psychology:
      "Privacy concern — very legitimate in today's environment. Address it factually and directly.",
    response:
      "That's a really reasonable concern, and I want to address it directly. Life insurance applications are protected under strict privacy laws — HIPAA applies, and insurers cannot share your medical information with anyone other than the underwriting process. Your information isn't sold or shared. And everything we discuss today is completely confidential. I take that seriously, and so does every licensed carrier I work with. Is there a specific part of the process you'd want me to walk you through?",
    followup:
      'Offer to show them the privacy disclosure document before they share anything. Transparency here builds more trust than any verbal reassurance.',
  },
  {
    id: 44,
    category: 'Self-Reliance',
    icon: '💪',
    objection:
      "I'm self-employed. My income varies too much for a fixed premium.",
    psychology:
      'They see a fixed monthly expense as a threat to their variable income.',
    response:
      "Being self-employed actually makes this more important, not less — because you don't have an employer safety net. And the good news is that premiums are very manageable: a $500k term policy for a healthy person runs roughly the same as one dinner out. You can also set payment schedules that work with your cash flow. The question isn't whether you can afford the premium — it's whether your business partners, your family, or your clients could absorb losing you overnight.",
    followup:
      'Explore annual premium payments at a discount — many self-employed people prefer paying once a year when cash flow is higher rather than monthly.',
  },
  {
    id: 45,
    category: 'Self-Reliance',
    icon: '🦅',
    objection:
      "I'm a very private person. I don't like discussing finances with anyone.",
    psychology:
      'Autonomy and privacy are core values for this person. Meet them on their terms and make it about facts, not feelings.',
    response:
      "I completely respect that — and honestly, this conversation doesn't have to go deep at all. I don't need your full financial picture to help you. I need three numbers: your income, your rough debt, and a monthly budget that feels comfortable. That's it. Everything else stays private. I'm not here to audit your life — I'm here to solve one specific problem: making sure the people you care about are protected if something happens to you.",
    followup:
      'Keep the conversation narrow and factual. Avoid relationship-building small talk with private types — they find it intrusive. Respect and efficiency earn their trust.',
  },
  {
    id: 46,
    category: 'Product',
    icon: '⏱️',
    objection:
      "20 years seems like a long time. What if I don't need it that long?",
    psychology:
      "They're second-guessing the commitment length. This is about uncertainty, not the product.",
    response:
      "Great question — and the good news is you're not locked in forever. You can cancel a term policy at any time with no penalty. You simply stop paying and the coverage ends. The 20-year term is actually the sweet spot because it covers your highest-risk financial window — your mortgage years, your kids' growing-up years, your peak earning period. And because you're locking in a longer term, the monthly rate is lower than a 10-year. If life changes, you can always adjust.",
    followup:
      "Ask: 'What specifically are you thinking might change in that window?' Their answer tells you whether they need a shorter term or just reassurance about flexibility.",
  },
  {
    id: 47,
    category: 'Product',
    icon: '🌀',
    objection: "What happens to all the money I've paid if I never use it?",
    psychology:
      "They see term insurance as a 'losing bet' if they outlive the policy.",
    response:
      "That's the same logic as asking what happens to your car insurance money if you never get into an accident. You paid for protection you hopefully never needed — and that's actually the best outcome. The alternative — needing to use it — is far more expensive in every way. That said, if you want a policy where you 'get something back,' there are return-of-premium term products and whole life options where your premiums build cash value. Want me to show you that side by side?",
    followup:
      'Return-of-premium (ROP) term is a great bridge product for this objection. The premiums are higher, but the prospect gets all premiums back if they outlive the term. It reframes insurance as a forced savings vehicle.',
  },
  {
    id: 48,
    category: 'Product',
    icon: '🔄',
    objection:
      "Can I just get a month-to-month policy? I don't want to commit.",
    psychology: 'Commitment aversion. They want control and flexibility.',
    response:
      "I understand the instinct — commitment feels risky. But here's the practical reality: month-to-month or short-term policies exist, but they're almost always more expensive per month, and you have no rate guarantee — your premium could go up any time. A 10 or 20-year term actually gives you more control because your rate is locked. That's the flexibility that actually protects you.",
    followup:
      "Lock-in language resonates here: 'The best way to keep your options open is to guarantee your rate right now. If you ever want to cancel, you can — but you can't uncancer a diagnosis or unage yourself to get this rate back.'",
  },
  {
    id: 49,
    category: 'Objection',
    icon: '📊',
    objection: "The economy is bad right now. I'm focused on just getting by.",
    psychology:
      "Economic anxiety is real. They're in survival mode. Show empathy first, then show them how protection fits even in lean times.",
    response:
      "You're not alone in feeling that way — and I hear you. But here's the thing about hard economic times: they're exactly when family financial protection matters most. If the economy is shaky and something happens to you, your family doesn't just lose you — they lose their financial anchor in an already difficult time. I'm not going to ask you to stretch your budget uncomfortably. But let me show you what the most basic level of coverage costs — it might surprise you.",
    followup:
      'Present your lowest-cost option. In economic hardship conversations, closing a small policy is far better than losing the sale entirely. A $100k policy is better than nothing.',
  },
  {
    id: 50,
    category: 'Objection',
    icon: '🧠',
    objection: 'I need to do more research before making any decision.',
    psychology:
      "Analysis paralysis — or another version of 'I need to think about it' dressed up as due diligence. The goal is to become the research.",
    response:
      "I love that you're a researcher — that's going to make you a great client because you'll actually understand what you're buying. Let me ask: what specifically do you want to research? Because I'd rather answer your questions directly than have you wade through a bunch of generic articles that may not apply to your situation. Tell me what you want to know, and let's work through it right now — that's the most efficient research you can do.",
    followup:
      'If they mention specific topics (riders, carriers, underwriting), address them immediately and thoroughly. Becoming the most informed person in the room is the best close for a researcher.',
  },

  // ── FROM THE FIELD ──
  {
    id: 51,
    category: 'Delay',
    icon: '💸',
    objection: "I can't decide until I get paid.",
    psychology:
      "A budget timing objection — but often a soft stall. The good news is this is one of the most workable objections because there's a clear, near-term endpoint. Work with the timeline, not against it.",
    response:
      "That's completely fair — and honestly, it's one of the most practical things someone can say. Here's what I'd suggest: let's go ahead and get you approved right now while we're talking. Approval doesn't cost anything, it locks in your rate and your health status today, and we can set the first payment to come out right after your next payday. You don't pay a cent until you're ready. The only thing we're locking in today is eligibility — and that's worth everything.",
    followup:
      'Offer to date the first payment 2–4 weeks out. Most carriers allow a delayed start date. This removes the financial barrier entirely while keeping the momentum moving.',
  },

  {
    id: 52,
    category: 'Process',
    icon: '📞',
    objection: "I don't want to make a decision over the phone.",
    psychology:
      "A control and trust objection. The prospect isn't comfortable committing to something significant without feeling more in control of the process. They associate phone sales with pressure — which is the opposite of how you want them to feel.",
    response:
      "I completely respect that — and I want to be clear: I'm not asking you to make a final decision right now. What I'm asking for is 10 minutes to get you pre-approved so that when you ARE ready, everything is already in place. The actual decision — signing, confirming, paying — that happens after you've had a chance to review everything in writing. Nothing gets finalized until you say go. Does that feel more comfortable?",
    followup:
      "Offer to email a summary of everything discussed before they commit to anything. The phrase 'you'll have everything in writing before we go any further' is extremely powerful for this objection.",
  },

  {
    id: 53,
    category: 'Comparison',
    icon: '🏷️',
    objection: 'I got a lower rate somewhere else.',
    psychology:
      "A real competitive objection — and one of the most credible ones. The prospect has done actual research. Don't dismiss it. Investigate it, then reframe around value and service.",
    response:
      "Good — I'm glad you got another quote, that means you're serious about this. Can I ask a couple of quick questions about it? Because not all rates are comparable — 'approved rate' versus 'quoted rate' are two very different things. A lot of quotes you see online are what's called preferred rates, which assume perfect health. Once underwriting reviews your full history, that number often changes. Let me run your actual numbers and we'll compare apples to apples — if they're genuinely better after underwriting, I'll tell you.",
    followup:
      "Ask: 'Was that a firm approved rate or a quote based on the information you provided?' Most people don't know the difference. That question alone repositions you as the expert.",
  },

  {
    id: 54,
    category: 'Price',
    icon: '📉',
    objection: 'The premium seems too high for my budget.',
    psychology:
      "A more measured version of 'I can't afford it' — the prospect isn't saying no, they're saying the current number doesn't fit. This is negotiation, not rejection. Work the number.",
    response:
      "I hear you — and that's exactly the conversation I want to have. Let me ask: what monthly number would feel completely manageable for your budget right now? Give me a number that you'd barely notice leaving your account. Because there's almost always a policy that fits that number — it might be a different coverage amount, a different term, or a different carrier — but I'd rather find you something that works than lose you over a number we can adjust.",
    followup:
      "Always have a 'budget version' ready. A smaller policy that someone actually keeps is worth infinitely more than a perfect policy they cancel in 90 days.",
  },

  {
    id: 55,
    category: 'Urgency',
    icon: '💀',
    objection: "I'm not planning to die anytime soon.",
    psychology:
      'A deflection disguised as humor — but underneath it is a genuine belief that mortality is irrelevant to them right now. They need a gentle reality check without being morbid.',
    response:
      "Ha — I hope not either, and statistically you're probably right. But here's the thing: life insurance isn't bought because you're planning to die. It's bought because the people who love you aren't planning for you to either. The question isn't when — it's what happens to your family in the gap between their world with you in it and their world without you. That gap is financial, and it's real. Today's the cheapest day to fill it.",
    followup:
      "Keep it light but let the reality land. Don't push morbid statistics — let the emotional truth of the family gap do the work. Then pivot immediately to the next step.",
  },

  {
    id: 56,
    category: 'Confusion',
    icon: '🔭',
    objection: "I'm not sure how much coverage I actually need.",
    psychology:
      "Genuine confusion — not resistance. They want guidance, not a sales pitch. This is your moment to be an expert, not a salesperson. Lead them through a simple calculation and they'll feel understood.",
    response:
      "That's the most common question I get — and it's the right one to ask. Here's the formula I use: take your annual income and multiply it by 10. That's your baseline. Then add any outstanding debts — your mortgage, car loans, anything that would fall on your family. That total is the number that keeps your family whole if something happens to you. For most people it lands between $500k and $1 million. Want me to run it with your numbers right now? It takes about 60 seconds.",
    followup:
      "Do the math out loud with them — don't just give them a number, build it together. When they participate in calculating the number they own it, and that changes the conversation.",
  },

  {
    id: 57,
    category: 'Delay',
    icon: '🤷',
    objection: "I'm still not sure.",
    psychology:
      "Late-stage hesitation — they've heard everything but still haven't moved. This is almost never about information. It's about comfort and trust. The question is whether there's a specific unresolved concern or just general inertia.",
    response:
      "I appreciate you being honest with me — 'not sure' is one of the most useful things you can say because it tells me we're not quite there yet. Can I ask: is there one specific thing that still feels unresolved for you? Because if there's a real question I haven't answered, I want to answer it. And if it's just a gut feeling about timing, I can work with that too. What would need to be true for this to feel like the right call?",
    followup:
      "'What would need to be true for this to feel like the right call?' is one of the most powerful questions in sales. It transfers the objection from the agent's problem to the prospect's clarity — and usually surfaces the real issue immediately.",
  },

  {
    id: 58,
    category: 'Price',
    icon: '📊',
    objection: "I'm worried the price will go up.",
    psychology:
      "A legitimate concern rooted in experiences with other insurance products like health or auto that do increase annually. Most people don't know that term life rates are locked at approval.",
    response:
      "That's actually one of the biggest misconceptions about life insurance — and I'm really glad you brought it up. Term life insurance rates are locked in at the time you're approved. Once you sign, that number never goes up, no matter what happens to your health, no matter how old you get, no matter what the market does. The premium you agree to today is the premium you'll pay for the entire term. That's one of the things that makes doing this now — while you're healthy — so valuable.",
    followup:
      "Offer to put it in writing: 'I can show you exactly where it says that in the policy language — it's called a level premium guarantee. Would that help?' Showing the actual policy language turns a concern into a confirmed benefit.",
  },

  {
    id: 59,
    category: 'Comparison',
    icon: '🔎',
    objection: 'I want to look around for other options first.',
    psychology:
      "The prospect wants to feel like a smart, informed buyer. This is a self-protection mechanism — they don't want to feel sold. The key is to either become the research or give them a reason the search will lead back to you.",
    response:
      "Absolutely — and you should. Here's what I'd suggest though: let me do that research with you right now. I have access to multiple carriers and I can show you what the market actually looks like in about 5 minutes. That way you get the benefit of comparison shopping without spending the next three weeks getting calls from 10 different agents all trying to close you. You'd be getting the same information — just faster and from one person you've already talked to. Want to do it right now?",
    followup:
      'Offering to be their comparison shopping tool is one of the most disarming moves in insurance sales. It positions you as a resource rather than a salesperson, and keeps the conversation moving forward instead of deferring it.',
  },

  {
    id: 60,
    category: 'Trust',
    icon: '🔐',
    objection: "I don't trust giving my information over the phone.",
    psychology:
      "A very legitimate concern in an age of scams and data breaches. The prospect isn't being difficult — they're being smart. Your job is to validate the concern and then demonstrate credibility clearly and specifically.",
    response:
      "That is a completely reasonable concern and I respect it — there are a lot of scams out there and you should be careful. So let me be transparent: I'm a licensed insurance agent, my license number is [X], and you can verify it right now on your state's Department of Insurance website. Everything you share goes directly to the carrier's encrypted systems — not stored on my end, not sold anywhere. I'd also encourage you to look me up before we go any further. I'd rather earn your trust than rush past it.",
    followup:
      "Have your license number memorized and ready. Offer to text it or email it before the prospect shares anything. Being the first person to say 'look me up' is the most powerful credibility move available to you.",
  },

  {
    id: 61,
    category: 'Spouse',
    icon: '👨‍👩‍👧',
    objection: 'I need to talk to my family first.',
    psychology:
      'A broader version of the spouse objection — this could mean parents, adult children, or a blended family situation. The dynamic is different from a spousal objection because you may have less visibility into who the decision-makers actually are.',
    response:
      "Of course — this affects everyone and it makes sense to loop them in. Can I ask who specifically you'd want to talk to? Because I'd love to be part of that conversation if possible — I can answer their questions directly rather than having you try to relay everything. A quick 15-minute call with the whole family is actually the cleanest way to get everyone on the same page at once. Would that work, or would you prefer to talk to them first and then come back to me with their questions?",
    followup:
      "If they want to talk to family first, arm them: 'Here's what I'd suggest sharing with them...' Give them 2–3 specific talking points so the family conversation is informed rather than vague. Vague family conversations almost always end in no.",
  },

  {
    id: 62,
    category: 'Urgency',
    icon: '🍀',
    objection: "Nothing's going to happen to me.",
    psychology:
      "Pure optimism bias — the deeply human tendency to believe bad things happen to other people, not us. This isn't denial exactly, it's a subconscious defense mechanism. Don't argue with the belief. Agree with it, then reframe around what the policy actually does.",
    response:
      "I genuinely hope you're right — and statistically, you probably are. But here's the thing: life insurance isn't a bet that something will happen. It's a guarantee that if it does, your family doesn't have to figure out how to survive it financially. Nobody who buys life insurance expects to use it. The ones who do buy it are just the ones who love their family enough to plan for the one scenario they can't control. You're not being pessimistic — you're being prepared.",
    followup:
      "Follow with a grounding question: 'If I told you there was a way to guarantee your family keeps their home, their lifestyle, and their future — no matter what — for less than a dinner out per week, would that be worth a conversation?' Almost no one says no to that framing.",
  },

  {
    id: 63,
    category: 'Spouse',
    icon: '👧👦',
    objection: 'I need to run this by my children first.',
    psychology:
      "An older prospect — likely 55+ — who has involved adult children in major financial decisions. This is a respect-driven dynamic, not weakness. The children are often the real objectors, and they're almost always motivated by protecting their parent from what they perceive as a sales pitch.",
    response:
      "I love that your children are involved in your financial decisions — that's a real sign of a close family. And I'd genuinely welcome the chance to talk with them. In my experience, adult children who are hesitant about life insurance change their minds very quickly when they realize what they'd actually be responsible for without it — final expenses, outstanding bills, estate costs. Would it be possible to get them on a quick call together? Ten minutes with the family is usually all it takes.",
    followup:
      "If they want to speak with children first, offer a leave-behind they can share: a simple one-pager showing final expense costs, estate settlement fees, and the average cost of a policy at their parent's age. Children respond to numbers, not emotion — give them the numbers.",
  },

  {
    id: 64,
    category: 'Delay',
    icon: '💔',
    objection: "I'm going through a divorce right now.",
    psychology:
      "The prospect is in genuine financial and emotional upheaval. They're not stalling — they feel legitimately overwhelmed and uncertain about their future obligations. The instinct to pause everything is understandable but actually counterproductive when it comes to life insurance specifically. This moment is one of the most important times to have coverage in place.",
    response:
      "I'm really sorry to hear that — divorce is one of the hardest things anyone goes through, and I completely understand the instinct to put everything on hold. But I want to share something that might actually matter right now: divorce is one of the most important times in your life to have your own personal coverage in place. If you were on a spouse's policy, that coverage is likely going away. Your financial obligations — to your kids, to any shared debts — don't pause during the process. Getting something locked in now, in your own name, at today's rates, protects you through the transition and beyond.",
    followup:
      "Be sensitive but direct. Acknowledge the difficulty genuinely — don't rush past it. Then pivot: 'The one thing divorce doesn't change is what your kids would need if something happened to you. Can we at least make sure that piece is covered while everything else gets sorted out?' That reframe almost always lands.",
  },

  {
    id: 65,
    category: 'Comparison',
    icon: '🏦',
    objection: 'I want to check with my credit union or bank first.',
    psychology:
      "The prospect has an existing trusted financial relationship and wants to feel like a loyal, smart consumer. This isn't hostility — it's comfort-seeking. They're not saying no to insurance, they're saying yes to familiarity. The key is to validate the relationship while gently exposing the gap between what a bank offers and what a specialist provides.",
    response:
      "That makes complete sense — your credit union relationship is built on trust and I respect that. Here's something worth knowing though: credit unions and banks typically offer group or affiliated insurance products with limited carriers, limited coverage options, and rates that often run higher than what's available through a licensed specialist. I'm not asking you not to check — please do. But when you get their quote, call me back and I'll run the same coverage through multiple carriers so you can see a real side-by-side comparison. Most people are surprised by the difference.",
    followup:
      "Ask: 'Do you know if your credit union offers term life specifically, or just whole life or accidental death products?' Most bank-affiliated insurance is limited in type and coverage amount. That question alone usually opens their eyes to the gap.",
  },

  {
    id: 66,
    category: 'Comparison',
    icon: '📬',
    objection: 'I received a much better offer or quote in the mail.',
    psychology:
      "The prospect has a physical piece of paper in their hand that feels credible and real. Mail offers create an illusion of legitimacy — they assume if it came in the mail it must be legit and competitive. The reality is that mail solicitation insurance is almost always simplified issue with significant limitations buried in the fine print. And critically — it's just a quote, not an approved rate.",
    response:
      "I'm really glad you mentioned that — because mail offers are one of the most misleading things in the insurance industry and I want to make sure you're comparing the right things. First, what you received is a quote — not an approved rate. The moment you actually apply and go through underwriting, that number will almost certainly change based on your full health picture. We just went through that process together, so you know exactly how detailed it gets. Second, most mail quotes are for simplified issue or guaranteed issue policies — the coverage amounts are usually very low, the premiums are much higher per dollar of coverage, and the fine print often includes waiting periods before the full benefit pays out. The number on that mailer was designed to get your attention, not to reflect what you'd actually pay.",
    followup:
      "Ask them to read you the coverage amount, the monthly cost, and whether there's a waiting period. Then say: 'That quote was generated before they know anything about your health. Once you apply and they review your history, that number will change. The rate I gave you today is based on your actual information — that's a real number, not a teaser.' Let the contrast speak for itself.",
  },

  {
    id: 67,
    category: 'Price',
    icon: '🚗',
    objection:
      'I just bought a new car and added car insurance. I already have a new bill.',
    psychology:
      "The prospect is feeling the real financial pressure of a recent purchase. They're not being difficult — they're being honest about their budget. The key is to validate the timing without letting them off the hook, then reframe life insurance as the one bill that could actually eliminate all the others.",
    response:
      "I completely understand — a new car is exciting and a new bill is real. I'm not here to squeeze you into something that's going to make things tight. But I want to share something worth thinking about: life insurance is the only bill you'll ever pay that could pay off every other bill you have. Your car payment, your car insurance, your rent, your groceries — if something happened to you, this is the one thing that keeps all of that going for your family. We don't have to do the maximum. Let's find a number that fits comfortably alongside that new car payment and protects everything you just worked for.",
    followup:
      "Lead with the smallest viable option. Frame it as protecting the new car, not adding to the burden: 'You just invested in something valuable — let's make sure your family can keep it if something happens to you. What monthly number feels manageable right now?'",
  },

  {
    id: 68,
    category: 'Delay',
    icon: '📱',
    objection:
      "I'm really busy right now. I didn't expect to be on the phone this long.",
    psychology:
      'This is a time objection, not a product objection. The prospect may be genuinely interested but feeling overwhelmed by the length of the conversation. The worst thing you can do is push harder — but the second worst thing is to be a pushover. Your time is just as valuable as theirs. Set that tone clearly, secure a firm commitment, and make sure they have your information.',
    response:
      "I completely understand — and I respect your time. But I want you to know that my time is just as valuable as yours. I'm responsible for helping thousands of families every year, and every missed appointment means a family I wasn't able to protect. I don't say that to pressure you — I say it so we treat each other's time with the same respect. So let's do this right: what time are you typically home in the evenings — and will your spouse be available too? I'd love to get you both on the same call so we only have to do this once. I'm going to give you my name and number right now — I want you to write it down. My name is [Name] and my number is [Number]. Got it? Great. And confirm your number for me so I have it as well. Now — we said what time?",
    followup:
      "That last question — 'we said what time?' — is the most important part. It makes them repeat the appointment back to you which means they wrote it down and they're committed to it. If they hesitate or can't remember, that tells you the appointment isn't real. Reconfirm or reschedule on the spot. Never leave a callback without the prospect repeating the time back to you.",
  },

  {
    id: 69,
    category: 'Objection',
    icon: '🚫',
    objection: "I'm not interested.",
    psychology:
      "The bluntest objection in sales — but rarely the whole truth. 'Not interested' almost always means one of two things: they think they can't afford it, or they think they won't qualify. Identifying which one immediately reframes the conversation from a closed door to an open question.",
    response:
      "I hear you completely. But can I ask you one quick question before we hang up? When you say you're not interested — is it because you're worried about what it might cost, or is it because you're not sure you'd even qualify for coverage? Because those are two very different conversations and I want to make sure I'm not wasting your time on the wrong one.",
    followup:
      "Whatever they answer, you have a path forward. If it's cost: 'Let me show you the lowest possible entry point — you might be surprised.' If it's qualifying: 'Most people who think they won't qualify actually do — let me run your information and the worst that happens is we find out for certain.' Either way, 'not interested' just became a conversation.",
  },

  {
    id: 70,
    category: 'Trust',
    icon: '✅',
    objection: "I've already got it taken care of.",
    psychology:
      "This sounds like a closed door but it's actually an opening. 'Taken care of' is vague — it could mean a small employer policy, an old whole life plan from years ago, or a policy that made sense once but doesn't fit their life anymore. The goal is to find out what they actually have without being dismissive of it.",
    response:
      "That's wonderful — honestly, that puts you ahead of most people I speak with. Can I ask — were you looking to potentially find something more budget friendly than what you currently have, or were you thinking about adding more coverage as your family or financial situation has grown? Because sometimes what made sense a few years ago doesn't quite match where life has taken you since then.",
    followup:
      "Listen carefully to their answer. If they have employer coverage: pivot to portability. If they have an old whole life policy: ask when it was last reviewed and what the coverage amount is. If they have a small policy: ask if it would actually cover everything their family would need. The question 'when did you last review it?' opens more doors than almost anything else.",
  },

  {
    id: 71,
    category: 'Trust',
    icon: '🤔',
    objection:
      "I don't even know what you're talking about. I don't remember filling anything out.",
    psychology:
      "Extremely common with purchased or aged leads — the prospect genuinely doesn't remember the form, or they filled out so many things online they've lost track. This isn't hostility, it's confusion. Your job is to anchor them with their own specific information so the memory clicks back into place. The moment they recognize their own data, the conversation shifts from skepticism to engagement.",
    response:
      "That's completely okay — and actually that's exactly why I'm calling, to follow up personally. The form you filled out was a little while back. I just want to make sure I have the right person — I have your date of birth listed as [DOB] and your email as [email]. Is that ringing a bell? You were looking into some information about life insurance coverage for you and your family. I just want to make sure you got everything you were looking for and answer any questions you might have.",
    followup:
      "Let them confirm their own information — don't move forward until they say 'yes that's me' or something similar. That confirmation is the psychological shift from 'who is this?' to 'oh right, I did fill that out.' Once they've confirmed their own data the conversation completely changes tone. If they still deny it after confirming their info, verify you have the right number and move on graciously.",
  },

  {
    id: 72,
    category: 'Delay',
    icon: '📅',
    objection: "I don't make decisions on the same day.",
    psychology:
      "A control objection — the prospect is asserting their decision-making style as a defense mechanism. They're not saying no to the product, they're saying no to feeling rushed. The key is to validate their style completely while reframing that nothing about today requires a final decision — only a conversation.",
    response:
      "I completely respect that — and I want you to know I'm not here to push you into anything today. The best decisions are made when you feel fully informed and completely comfortable. What I'd love to do is just make sure you have everything you need so that when you are ready to decide, you're making the most informed choice possible. I'm not asking you to decide today. I'm asking you to just get the information. Can we do that together?",
    followup:
      "Separate information from decision in their mind. 'Getting information today' and 'making a decision today' are two different things — and once they agree to the former, the latter often follows naturally. Never pressure the decision. Always invite the information.",
  },

  {
    id: 73,
    category: 'Objection',
    icon: '🎲',
    objection: "I don't take risks.",
    psychology:
      "This prospect sees life insurance as a financial risk or gamble — they may be the type who avoids commitments, contracts, or anything that feels like a bet. The brilliant reframe is that life insurance is actually the opposite of risk — it's the elimination of it.",
    response:
      "I love that about you — and here's the thing: life insurance isn't a risk. It's actually the only financial tool that eliminates risk entirely. Every other investment, every savings account, every retirement fund — those can go up or down. Life insurance is the one thing that says no matter what happens, your family is protected. You're not taking a risk by getting it. You're taking a risk by not having it. The person who doesn't take risks is exactly the person who should have life insurance.",
    followup:
      "Let that reframe land before you say anything else. Then ask: 'Does that make sense?' A prospect who prides themselves on not taking risks will respond to the logic that insurance removes risk rather than creating it.",
  },

  {
    id: 74,
    category: 'Objection',
    icon: '🙏',
    objection:
      "Worrying is a sin. I don't worry about anything. I take one day at a time.",
    psychology:
      "A faith-based or philosophical objection — the prospect lives by a genuine personal principle of trust and present-moment focus. This is deeply held and deserves real respect. The reframe isn't about worry at all — it's about stewardship and love.",
    response:
      "I love that perspective — and I want you to know this has nothing to do with worry. The most faith-filled, present-focused people I know have life insurance. Not because they're afraid of tomorrow, but because they love the people in their life deeply enough to make sure they're taken care of no matter what. This isn't about fear. It's about love. Taking one day at a time is a beautiful way to live — and this is just making sure that every day your family is protected by someone who loves them.",
    followup:
      "Never argue with faith or philosophy. Meet it with equal sincerity. The pivot from worry to love and stewardship is the only reframe that works here. If they're still resistant, ask: 'Is there someone in your life — a child, a parent, a partner — who would struggle financially if something happened to you?' That question brings it home without invoking fear.",
  },

  {
    id: 75,
    category: 'Spouse',
    icon: '⚔️',
    objection: 'One spouse says yes and the other says no.',
    psychology:
      "A divided household is one of the most challenging dynamics in insurance sales. The yes spouse is your ally but can't close it alone. The no spouse has an objection you haven't heard yet — your job is to get it surfaced directly rather than filtered through their partner.",
    response:
      "I completely understand — and this is actually one of the most common situations I come across. I'd love to speak with both of you together if possible, because the concerns are usually very different and I want to make sure I'm addressing the right ones. [To the yes spouse]: I hear you and I appreciate your support. [To the no spouse]: I want to make sure I understand your hesitation specifically — is it about the cost, the timing, or something else entirely? Because whatever it is, I'd rather address it directly than have it hang over this conversation.",
    followup:
      'Never try to close over the no spouse by working only with the yes spouse. That creates resentment and almost always leads to a cancellation later. Get the no spouse talking — their real objection is almost always price, timing, or trust. Once you know what it actually is, you can address it. The goal is both spouses feeling heard, not one spouse winning an argument.',
  },

  {
    id: 76,
    category: 'Objection',
    icon: '😤',
    objection:
      'Prospect is being cranky, combative, or trying to take control of the appointment.',
    psychology:
      "Some prospects use aggression or control as a defense mechanism — they're used to being sold to and they're pre-emptively pushing back. The instinct is to soften or back down. The right move is the opposite: ask permission to be direct. This disarms them completely because it's the last thing they expect.",
    response:
      "[Use their name] — do I have permission to be direct with you? [Pause for yes.] I understand this is important to you. And I'm sure there's someone in your life — someone you love — who you would never want to be stuck paying out of pocket when you're gone. Is that a fair statement? [Pause for answer.] Good. Then the best way I can help you is by finding the best policy at the best price to protect that person. I can't do that if you don't let me do my job. So let's work together — what's your biggest concern right now?",
    followup:
      "Asking permission to be direct is one of the most powerful moves in sales because it transfers control willingly — and they accept it. Once they say yes to 'can I be direct,' they've psychologically agreed to hear you out. The pause after each question is essential. Don't fill the silence. Let them answer. Their answers tell you everything you need to close.",
  },

  {
    id: 77,
    category: 'Objection',
    icon: '💬',
    objection:
      'Just give me the quote. They keep asking for a number and want to get off the phone.',
    psychology:
      "The prospect is using the quote request as an exit strategy — if they get a number they can say it's too high and hang up. A quote without context is meaningless and almost always leads to an objection you can't handle. You must take call control by asking questions before you give any number.",
    response:
      "[Client name], I would absolutely love to give you that quote — that's exactly what I'm here to do. But before I can give you an accurate number, I need to best understand your situation so I'm not giving you something that doesn't fit. Can I ask — were you looking for coverage for yourself or for a loved one? [Wait for answer.] And what has you motivated to start looking into this right now — did something happen recently that's got you thinking about protecting your family?",
    followup:
      "You must end every response with a question — that's how you maintain call control. The moment you give a quote without context you lose the conversation. Questions keep you in the driver's seat. The 'did something happen recently' question is particularly powerful because it surfaces the emotional motivation behind the inquiry — and emotion is what closes policies, not price.",
  },

  {
    id: 78,
    category: 'Price',
    icon: '🐖',
    objection: "I'll just save my money instead.",
    psychology:
      "The prospect believes self-funded savings is equivalent to life insurance protection. They haven't done the math on how long it takes to accumulate meaningful savings versus how quickly a death benefit would be needed. The reframe is speed — savings takes decades, life insurance works on day one.",
    response:
      "That's a great habit and I love that you're thinking that way. But here's the challenge with that plan: savings takes years — sometimes decades — to build to a level that would actually protect your family. Life insurance works on day one. The moment your policy is approved, if something happened to you tonight, your family would have the full benefit. No savings account grows that fast. You can absolutely keep saving — in fact I'd encourage it. But while your savings is growing, this is what makes sure your family doesn't lose everything if something happens before you get there.",
    followup:
      "Ask: 'How much do you currently have saved?' Most people pause at that question because the honest answer is that it wouldn't be enough. You don't need them to say it out loud — the pause itself makes the point. Then say: 'That's exactly what this fills in while your savings catches up.'",
  },

  {
    id: 79,
    category: 'Process',
    icon: '💰',
    objection: "I don't feel comfortable giving you my income.",
    psychology:
      "A privacy and trust objection — the prospect doesn't understand why income is relevant and assumes it's being used to sell them a bigger policy. Transparency about why the question is asked almost always resolves it immediately.",
    response:
      "That's completely fair — and I want to be transparent about why I ask. Your income isn't something I report anywhere or use to set your price. Life insurance premiums are based on your age and health, not your income. The reason I ask is simply to make sure the coverage amount we discuss would actually replace what your family depends on if you weren't here. If I don't know what they need to maintain their lifestyle, I can't recommend the right amount of coverage. It's purely about making sure we're protecting the right number for your family.",
    followup:
      "If they're still hesitant: 'You don't have to give me an exact number — even a rough range helps me make sure we're in the right ballpark. Are we talking closer to $30,000 a year or $80,000 a year?' Giving them a range to pick from feels much less invasive than an open-ended income question.",
  },

  {
    id: 80,
    category: 'Process',
    icon: '🔒',
    objection:
      "I don't feel comfortable giving my Social Security number over the phone.",
    psychology:
      "A completely legitimate concern in today's environment — and one that deserves a genuine, reassuring answer. But there's also a deeper reframe available: the SSN isn't just for the application. It's the key that unlocks the claim for your beneficiary when they need it most.",
    response:
      "I completely understand that — and your instinct to protect your information is a good one. Here's what I want you to know: your Social Security number goes directly to the carrier's encrypted application system. It's never stored on my end. But here's something worth thinking about — [client name], if God forbid anything happened to you and your [beneficiary] didn't have the policy number, they can provide your Social Security number to the carrier to file the claim. It's actually one of the most important pieces of information your family will have access to when they need it most. Does that make sense?",
    followup:
      "That reframe — from 'they want my SSN' to 'my family will need this to collect the benefit' — is one of the most powerful pivots in insurance sales. It shifts the SSN from a data vulnerability to a gift they're leaving for their loved ones. Let that land before you say anything else.",
  },

  {
    id: 81,
    category: 'Comparison',
    icon: '🔍',
    objection: 'I really need to shop around before I make a decision.',
    psychology:
      'The prospect wants to feel like a smart consumer. Shopping around feels responsible. The key is to validate the instinct while positioning yourself as the shopping — and surfacing the real risk of waiting while they compare.',
    response:
      "Absolutely — and you should feel good about doing your due diligence. Here's what I'd offer though: I work with multiple carriers, which means I've essentially already done the shopping for you. I've already compared rates, underwriting guidelines, and claim reputations across the market to find what fits your situation best. If you go shopping on your own you'll spend weeks getting calls from agents all quoting the same regulated rates — and in the meantime your age and health stay the same today but not tomorrow. What specifically are you hoping to find by shopping around? Let me see if I can answer that right now.",
    followup:
      "Whatever they say they're looking for — better price, different coverage, more options — address it directly. Then ask: 'If I could show you that what I have is competitive with anything else on the market, would you be comfortable moving forward today?' That question separates genuine shoppers from people using shopping as a delay tactic.",
  },

  {
    id: 82,
    category: 'Process',
    icon: '📬',
    objection:
      'I need to see it in the mail or in writing before I make a decision or pay anything.',
    psychology:
      "This prospect values documentation, transparency, and control. They're not saying no — they're saying they need to feel safe before they commit. This is one of the most workable objections in insurance because the entire system is designed to accommodate it. Use their own words to walk them straight into the close.",
    response:
      "[Client name], I totally understand — and honestly that's exactly how most of my clients feel. It sounds to me like you value this, you just need to see everything in writing to make sure you know what you're signing up for. Is that about right? [Pause.] Okay — so just so I'm on the same page, you want this policy, you just need to see everything before you move forward. Here's what we're going to do: let's go ahead and check your eligibility first, put your beneficiaries down, put your payment information in, and I'll push your start date out a few weeks. Before we hit submit we'll go through everything line by line so you know exactly what you're signing up for. And then — I'll call you back personally when that policy arrives in the mail, a few days before your first payment date, and we'll go through it again word by word. You'll see everything in writing before a single dollar comes out. Does that sound fair?",
    followup:
      "This close works because it gives them everything they asked for — they see it in writing, they review it before submitting, and they review it again before paying. You've removed every barrier they raised. The key phrase is 'does that sound fair?' — almost no one says no to something that is genuinely fair. And then bring back the consequence they shared earlier: 'You told me earlier that [loved one] would be stuck with the burial expenses — let's make sure that doesn't happen while we get this set up properly.'",
  },

  {
    id: 83,
    category: 'No Need',
    icon: '👨‍👩‍👧‍👦',
    objection: 'My kids can pay for my burial.',
    psychology:
      "The prospect believes their children are both willing and financially able to cover end-of-life expenses without a policy. This isn't about money — it's about identity. They see themselves as someone whose family will take care of things. The reframe isn't to challenge that belief but to lovingly question why they'd want to place that burden on the people they love most.",
    response:
      "Wow — that's such an amazing blessing that your kids are in a position to do that for you. I really mean that. But I have to ask you something, and I hope you'll let me be direct: why is it so important to you that you don't leave anything for your kids to help pick up the pieces after you're gone? Because most parents I talk to — their whole life has been about making things easier for their children, not harder. A funeral today costs anywhere from $10,000 to $15,000 or more. That's money coming straight out of your kids' pockets, during one of the hardest moments of their lives, while they're grieving. Is that really the last gift you want to leave them?",
    followup:
      "Let that question land in silence. Don't fill it. The reframe from 'my kids will handle it' to 'is that the last gift you want to leave them' is emotional and powerful — but it's not manipulation, it's truth. Most parents haven't thought about it from that angle. If they push back, ask: 'Do your kids know that's the plan?' That question alone usually shifts the conversation completely.",
  },

  {
    id: 84,
    category: 'Process',
    icon: '🏦',
    objection: "I can't find my banking information.",
    psychology:
      "A stall tactic — sometimes genuine, sometimes not. Either way the worst thing you can do is solve it for them by offering alternatives. When you solve their problem you take ownership of it. When you put it back on them, they find a way. The prospect almost always has more options than they're letting on — they just need to be asked what they think they should do.",
    response:
      '[Client name], I completely understand — these things happen. But let me ask you something: what do you think we should do? [Pause and wait.] I want to make sure we get this taken care of for you today, but I also want you to feel good about how we move forward. What are your options right now?',
    followup:
      "Put the problem back in their court and wait. Most prospects will come up with the solution themselves — 'I could call my bank,' 'I think I have it in my email,' 'let me check my phone.' The moment they generate the solution it becomes their idea and their commitment. If they genuinely can't find it, offer: 'Would it help if we scheduled a callback for later today when you have it in front of you?' — but only after they've exhausted their own ideas. Never be the first one to solve it.",
  },
];

const categories = [
  'All',
  ...Array.from(new Set(objections.map((o) => o.category))),
];
const NOTES_KEY = 'handled_notes_v1';
const AI_KEY = 'handled_ai_v1';
const FAVS_KEY = 'handled_favs_v1';

function loadFavs() {
  try {
    return JSON.parse(localStorage.getItem(FAVS_KEY) || '[]');
  } catch {
    return [];
  }
}
function saveFavs(f) {
  try {
    localStorage.setItem(FAVS_KEY, JSON.stringify(f));
  } catch {}
}

const C = {
  bg: '#0a0a0a',
  surface: '#111111',
  surfaceHover: '#161616',
  border: '#1e1e1e',
  borderAccent: '#2a2a2a',
  cream: '#f0ece3',
  creamDim: '#a09890',
  creamFaint: '#4a4540',
  gold: '#c9a96e',
  goldDim: '#6b5a3a',
  blue: '#4a8ff5',
  green: '#3db88a',
  purple: '#8b5cf6',
};

function loadNotes() {
  try {
    return JSON.parse(localStorage.getItem(NOTES_KEY) || '{}');
  } catch {
    return {};
  }
}
function saveNotes(n) {
  try {
    //localStorage.setItem(NOTES_KEY, JSON.stringify(n));
    // New: Sync to Supabase
    syncNote(id, noteText);
  } catch {}
}
function loadAIHistory() {
  try {
    return JSON.parse(localStorage.getItem(AI_KEY) || '[]');
  } catch {
    return [];
  }
}
function saveAIHistory(h) {
  try {
    localStorage.setItem(AI_KEY, JSON.stringify(h.slice(-20)));
  } catch {}
}

export default function HandledApp() {
  const [mode, setMode] = useState('study');
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');
  const [selected, setSelected] = useState(null);
  const [expanded, setExpanded] = useState('response');
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizRevealed, setQuizRevealed] = useState(false);
  const [fade, setFade] = useState(true);
  const [notes, setNotes] = useState({});
  const [editNote, setEditNote] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [rtSearch, setRtSearch] = useState('');
  const [favs, setFavs] = useState([]);
  const [showFavsOnly, setShowFavsOnly] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiHistory, setAiHistory] = useState([]);
  const [aiError, setAiError] = useState('');
  const { syncFavorite, syncNote } = useSync(); // Add this at the top of HandledApp
  const [isSyncing, setIsSyncing] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    setNotes(loadNotes());
    setAiHistory(loadAIHistory());
    setFavs(loadFavs());
  }, []);

  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [aiResult, aiLoading]);

  // Inside HandledApp()
  const { getToken, isLoaded, userId, signOut } = useAuth();

  useEffect(() => {
    const syncFromCloud = async () => {
      if (!isLoaded || !userId) return;

      try {
        const supabase = await getSupabaseClient(getToken);

        // Fetch both Notes and Favorites in parallel for speed
        const [notesRes, favsRes] = await Promise.all([
          supabase
            .from('notes')
            .select('objection_id, content')
            .eq('user_id', userId),
          supabase
            .from('favorites')
            .select('objection_id')
            .eq('user_id', userId),
        ]);

        // 1. Update Notes State
        if (notesRes.data) {
          const cloudNotes = notesRes.data.reduce((acc, curr) => {
            acc[curr.objection_id] = curr.content;
            return acc;
          }, {});

          // Merge cloud notes with local (Cloud wins)
          setNotes((prev) => ({ ...prev, ...cloudNotes }));
        }

        // 2. Update Favorites State
        if (favsRes.data) {
          const cloudFavs = favsRes.data.map((f) => f.objection_id);
          // Merge and remove duplicates using a Set
          setFavs((prev) => Array.from(new Set([...prev, ...cloudFavs])));
        }
      } catch (err) {
        console.error('Modern fetch failed:', err);
      } finally {
        setIsSyncing(false);
      }
    };

    syncFromCloud();
  }, [isLoaded, userId, getToken]);

  const isFav = (id) => favs.includes(id);
  const toggleFav = (id, e) => {
    e.stopPropagation();

    // ✅ Define 'adding' by checking if the ID is NOT already in favorites
    const adding = !isFav(id);

    const updated = adding ? [...favs, id] : favs.filter((f) => f !== id);
    setFavs(updated);
    saveFavs(updated);

    // Now 'adding' is defined and can be synced to Supabase
    syncFavorite(id, adding);
  };

  const filtered = objections.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch =
      o.objection.toLowerCase().includes(q) ||
      o.category.toLowerCase().includes(q);
    const matchCat = cat === 'All' || o.category === cat;
    const matchFav = !showFavsOnly || isFav(o.id);
    return matchSearch && matchCat && matchFav;
  });
  const rtFiltered = rtSearch
    ? objections.filter(
        (o) =>
          o.objection.toLowerCase().includes(rtSearch.toLowerCase()) ||
          o.category.toLowerCase().includes(rtSearch.toLowerCase()),
      )
    : showFavsOnly
      ? objections.filter((o) => isFav(o.id))
      : objections;

  const tf = (fn) => {
    setFade(false);
    setTimeout(() => {
      fn();
      setFade(true);
    }, 150);
  };
  const hasNote = (id) => !!notes[id];
  const openNote = (id) => {
    setNoteText(notes[id] || '');
    setEditNote(true);
  };
  const saveNote = (id) => {
    if (isSyncing) return;
    const u = { ...notes, [id]: noteText };
    setNotes(u);
    saveNotes(u);
    setEditNote(false);

    // New: Sync to Supabase
    syncNote(id, noteText);
  };
  const delNote = (id) => {
    if (isSyncing) return;
    const u = { ...notes };
    delete u[id];
    setNotes(u);
    saveNotes(u);
    setEditNote(false);
    setNoteText('');

    // New: Remove from Supabase
    syncNote(id, null, true);
  };

  const askAI = async () => {
    if (!aiInput.trim() || aiLoading) return;
    setAiLoading(true);
    setAiResult(null);
    setAiError('');
    const text = aiInput.trim();
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: `You are an expert life insurance sales coach. A rep just heard an objection on a call. Give them a battle-tested response RIGHT NOW. Respond ONLY with valid JSON, no markdown:
{"category":"one of Price/Delay/Spouse/Trust/Skepticism/Urgency/Health/Confusion/Comparison/Process/Self-Reliance/Product/Objection","psychology":"2-3 sentences on the real reason behind this objection","response":"3-5 sentences the rep says out loud — warm, confident, conversational, first person","followup":"2-3 sentences of tactical advice if prospect pushes back"}`,
          messages: [
            { role: 'user', content: `The prospect just said: "${text}"` },
          ],
        }),
      });
      const data = await res.json();
      const raw = data.content?.map((b) => b.text || '').join('') || '';
      const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
      const entry = { objection: text, ...parsed, ts: Date.now() };
      setAiResult(entry);
      const h = [entry, ...aiHistory];
      setAiHistory(h);
      saveAIHistory(h);
      setAiInput('');
    } catch {
      setAiError('Something went wrong. Check your connection and try again.');
    }
    setAiLoading(false);
  };

  const modes = [
    { id: 'study', label: 'Study', icon: '◎' },
    { id: 'realtime', label: 'Live', icon: '●' },
    { id: 'quiz', label: 'Quiz', icon: '◈' },
    { id: 'ai', label: 'AI Coach', icon: '✦' },
  ];

  const catColor = {
    Price: C.gold,
    Delay: C.blue,
    Spouse: '#e87d6b',
    Trust: C.green,
    Skepticism: '#a78bfa',
    Urgency: '#f59e0b',
    Health: '#34d399',
    Confusion: '#60a5fa',
    Comparison: '#f472b6',
    Process: '#94a3b8',
    'Self-Reliance': '#fb923c',
    Product: '#a3e635',
    Objection: C.creamDim,
  };

  const Pill = ({ label, active, onClick, color }) => (
    <button
      onClick={onClick}
      style={{
        padding: '5px 13px',
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.05em',
        border: `1px solid ${active ? color || C.cream : C.border}`,
        background: active
          ? color
            ? color + '18'
            : '#f0ece318'
          : 'transparent',
        color: active ? color || C.cream : C.creamFaint,
        cursor: 'pointer',
        transition: 'all 0.15s',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {label}
    </button>
  );

  const Section = ({ sKey, label, content, accent }) => (
    <div
      style={{
        marginBottom: 8,
        borderRadius: 10,
        overflow: 'hidden',
        border: `1px solid ${expanded === sKey ? accent + '40' : C.border}`,
      }}
    >
      <div
        onClick={() => setExpanded(expanded === sKey ? null : sKey)}
        style={{
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          borderLeft: `2px solid ${accent}`,
          background: expanded === sKey ? accent + '08' : 'transparent',
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: accent,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {label}
        </span>
        <span style={{ color: C.creamFaint, fontSize: 12 }}>
          {expanded === sKey ? '▲' : '▼'}
        </span>
      </div>
      {expanded === sKey && (
        <div
          style={{
            padding: '12px 16px',
            fontSize: 13,
            color: C.creamDim,
            lineHeight: 1.8,
            borderLeft: `2px solid ${accent}`,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {content}
        </div>
      )}
    </div>
  );

  const AICard = ({ entry }) => (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${C.borderAccent}`,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 12,
      }}
    >
      <div
        style={{
          padding: '14px 16px',
          borderBottom: `1px solid ${C.border}`,
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: `linear-gradient(135deg, ${C.blue}, ${C.purple})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            flexShrink: 0,
          }}
        >
          ✦
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              marginBottom: 5,
            }}
          >
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: C.blue,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              AI GENERATED
            </span>
            {entry.category && (
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  padding: '1px 7px',
                  borderRadius: 10,
                  background: C.border,
                  color: C.creamDim,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {entry.category}
              </span>
            )}
          </div>
          <div
            style={{
              fontSize: 13,
              color: C.cream,
              lineHeight: 1.4,
              fontStyle: 'italic',
              fontFamily: "'Playfair Display', serif",
            }}
          >
            "{entry.objection}"
          </div>
        </div>
      </div>
      {[
        {
          label: "Why They're Saying It",
          content: entry.psychology,
          accent: C.purple,
        },
        { label: 'Say This', content: entry.response, accent: C.blue },
        {
          label: 'If They Push Back',
          content: entry.followup,
          accent: C.green,
        },
      ].map((s) => (
        <div
          key={s.label}
          style={{
            borderLeft: `2px solid ${s.accent}`,
            padding: '11px 16px',
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <div
            style={{
              fontSize: 9,
              color: s.accent,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 6,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {s.label}
          </div>
          <div
            style={{
              fontSize: 13,
              color: C.creamDim,
              lineHeight: 1.8,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {s.content}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        background: C.bg,
        fontFamily: "'DM Sans', sans-serif",
        color: C.cream,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
        .hov { transition: all 0.15s; cursor: pointer; }
        .hov:hover { background: ${C.surfaceHover} !important; }
        .fade { opacity: 1; transition: opacity 0.15s; }
        .fade.out { opacity: 0; }
        input, textarea { font-family: 'DM Sans', sans-serif; }
        input:focus, textarea:focus { outline: none; border-color: ${C.borderAccent} !important; }
        .pulse { animation: pulse 1.4s ease-in-out infinite; }
        @keyframes pulse { 0%,100%{opacity:0.3} 50%{opacity:1} }
        .mode-btn { transition: all 0.2s; cursor: pointer; border: none; }
        .mode-btn:hover { opacity: 0.85; }
      `}</style>

      {/* Header */}
      <div
        style={{
          background: C.bg,
          borderBottom: `1px solid ${C.border}`,
          padding: '0 20px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: 720,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 56,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 18,
                fontWeight: 700,
                color: C.cream,
                letterSpacing: '0.05em',
              }}
            >
              HANDLED.
            </div>
            <div
              style={{
                fontSize: 9,
                color: C.creamFaint,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginTop: 1,
              }}
            >
              Life Insurance · {objections.length} Objections · handled.coach
            </div>
          </div>
          
          <div
            style={{
              display: 'flex',
              gap: 2,
              background: C.surface,
              borderRadius: 10,
              padding: 3,
              border: `1px solid ${C.border}`,
            }}
          >
            {modes.map((m) => (
              <button
                key={m.id}
                className='mode-btn'
                onClick={() => {
                  setMode(m.id);
                  setSelected(null);
                  setQuizRevealed(false);
                  setEditNote(false);
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 600,
                  background:
                    mode === m.id
                      ? m.id === 'ai'
                        ? `linear-gradient(135deg, ${C.blue}, ${C.purple})`
                        : C.cream
                      : 'transparent',
                  color:
                    mode === m.id
                      ? m.id === 'ai'
                        ? '#fff'
                        : C.bg
                      : C.creamFaint,
                  fontFamily: "'DM Sans', sans-serif",
                  boxShadow:
                    mode === m.id && m.id === 'ai'
                      ? `0 0 12px ${C.purple}40`
                      : 'none',
                }}
              >
                {m.icon} {m.label}
              </button>
            ))}
            
          </div>
          <button
              className="hov"
              onClick={() => signOut()}
              style={{
                background: 'transparent',
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: '6px 10px',
                color: C.creamDim,
                fontSize: 10,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Log Out
            </button>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 16px' }}>
        {/* ── STUDY ── */}
        {mode === 'study' && !selected && (
          <div>
            <div style={{ marginBottom: 14 }}>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search objections…'
                style={{
                  width: '100%',
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: 10,
                  padding: '11px 15px',
                  color: C.cream,
                  fontSize: 13,
                }}
              />
            </div>
            <div
              style={{
                display: 'flex',
                gap: 6,
                flexWrap: 'wrap',
                marginBottom: 10,
              }}
            >
              {categories.map((c) => (
                <Pill
                  key={c}
                  label={c}
                  active={cat === c && !showFavsOnly}
                  onClick={() => {
                    setCat(c);
                    setShowFavsOnly(false);
                  }}
                  color={catColor[c]}
                />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
              <button
                onClick={() => setShowFavsOnly(!showFavsOnly)}
                style={{
                  padding: '5px 13px',
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  border: `1px solid ${showFavsOnly ? C.gold : C.border}`,
                  background: showFavsOnly ? C.gold + '18' : 'transparent',
                  color: showFavsOnly ? C.gold : C.creamFaint,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  fontFamily: "'DM Sans', sans-serif",
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                ★ Favorites {favs.length > 0 && `(${favs.length})`}
              </button>
            </div>
            <div
              style={{
                fontSize: 10,
                color: C.creamFaint,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: 12,
              }}
            >
              {filtered.length} objections{' '}
              {Object.keys(notes).length > 0 &&
                `· ${Object.keys(notes).length} with notes`}
              {favs.length > 0 && ` · ${favs.length} favorited`}
            </div>
            {showFavsOnly && favs.length === 0 && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: C.creamFaint,
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 12, opacity: 0.4 }}>
                  ★
                </div>
                <div
                  style={{
                    fontSize: 13,
                    lineHeight: 1.7,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  No favorites yet.
                  <br />
                  Tap the star on any objection to save it here.
                </div>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {filtered.map((o) => (
                <div
                  key={o.id}
                  className='hov'
                  onClick={() => {
                    setSelected(o);
                    setExpanded('response');
                    setEditNote(false);
                  }}
                  style={{
                    background: C.surface,
                    border: `1px solid ${isFav(o.id) ? C.gold + '35' : C.border}`,
                    borderRadius: 11,
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <div style={{ fontSize: 20 }}>{o.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        marginBottom: 4,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          color: catColor[o.category] || C.creamDim,
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        {o.category}
                      </span>
                      {hasNote(o.id) && (
                        <span
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: '50%',
                            background: C.gold,
                            display: 'inline-block',
                            boxShadow: `0 0 4px ${C.gold}`,
                          }}
                        />
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: C.creamDim,
                        lineHeight: 1.4,
                      }}
                    >
                      "{o.objection}"
                    </div>
                  </div>
                  <button
                    onClick={(e) => toggleFav(o.id, e)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px 6px',
                      fontSize: 16,
                      color: isFav(o.id) ? C.gold : C.creamFaint,
                      transition: 'all 0.15s',
                      lineHeight: 1,
                      textShadow: isFav(o.id) ? `0 0 8px ${C.gold}` : 'none',
                    }}
                  >
                    {isFav(o.id) ? '★' : '☆'}
                  </button>
                  <div style={{ color: C.creamFaint, fontSize: 14 }}>›</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STUDY DETAIL ── */}
        {mode === 'study' && selected && (
          <div className={`fade ${fade ? '' : 'out'}`}>
            <button
              onClick={() => {
                setSelected(null);
                setEditNote(false);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: C.blue,
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.05em',
                marginBottom: 18,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              ← Back
            </button>

            <div
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: '20px',
                marginBottom: 14,
              }}
            >
              <div
                style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}
              >
                <div style={{ fontSize: 28 }}>{selected.icon}</div>
                <div style={{ flex: 1 }}>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: catColor[selected.category] || C.creamDim,
                      display: 'block',
                      marginBottom: 8,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {selected.category}
                  </span>
                  <div
                    style={{
                      fontSize: 17,
                      fontWeight: 600,
                      color: C.cream,
                      lineHeight: 1.4,
                      fontFamily: "'Playfair Display', serif",
                    }}
                  >
                    "{selected.objection}"
                  </div>
                </div>
                <button
                  onClick={(e) => toggleFav(selected.id, e)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    fontSize: 22,
                    color: isFav(selected.id) ? C.gold : C.creamFaint,
                    transition: 'all 0.15s',
                    lineHeight: 1,
                    flexShrink: 0,
                    textShadow: isFav(selected.id)
                      ? `0 0 10px ${C.gold}`
                      : 'none',
                  }}
                >
                  {isFav(selected.id) ? '★' : '☆'}
                </button>
              </div>
            </div>

            <Section
              sKey='psychology'
              label='Why They Say It'
              content={selected.psychology}
              accent={C.purple}
            />
            <Section
              sKey='response'
              label='Your Response'
              content={selected.response}
              accent={C.blue}
            />
            <Section
              sKey='followup'
              label='If They Push Back'
              content={selected.followup}
              accent={C.green}
            />

            {/* Notes */}
            <div
              style={{
                marginBottom: 12,
                background: C.surface,
                border: `1px solid ${hasNote(selected.id) ? C.gold + '40' : C.border}`,
                borderRadius: 11,
                overflow: 'hidden',
              }}
            >
              <div
                className='hov'
                onClick={() => !editNote && openNote(selected.id)}
                style={{
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderLeft: `2px solid ${C.gold}`,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: C.creamDim,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  ✏️ My Notes
                  {hasNote(selected.id) && (
                    <span
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: '50%',
                        background: C.gold,
                        display: 'inline-block',
                      }}
                    />
                  )}
                </span>
                {!editNote && (
                  <span
                    style={{
                      fontSize: 10,
                      color: C.gold,
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {hasNote(selected.id) ? 'Edit' : '+ Add'}
                  </span>
                )}
              </div>
              {editNote && (
                <div
                  style={{
                    padding: '0 14px 14px',
                    borderLeft: `2px solid ${C.gold}`,
                  }}
                >
                  <textarea
                    autoFocus
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder='Your version of this response, what works for you, personal reminders…'
                    style={{
                      width: '100%',
                      minHeight: 90,
                      background: C.bg,
                      border: `1px solid ${C.border}`,
                      borderRadius: 8,
                      padding: '10px 12px',
                      color: C.cream,
                      fontSize: 13,
                      lineHeight: 1.7,
                      resize: 'vertical',
                    }}
                  />
                  <div style={{ display: 'flex', gap: 7, marginTop: 9 }}>
                    <button
                      onClick={() => saveNote(selected.id)}
                      style={{
                        flex: 1,
                        padding: '9px',
                        background: C.gold,
                        borderRadius: 8,
                        border: 'none',
                        color: C.bg,
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Save Note
                    </button>
                    {hasNote(selected.id) && (
                      <button
                        onClick={() => delNote(selected.id)}
                        style={{
                          padding: '9px 12px',
                          background: 'transparent',
                          borderRadius: 8,
                          border: `1px solid #4a2020`,
                          color: '#f87171',
                          fontSize: 12,
                          cursor: 'pointer',
                        }}
                      >
                        Delete
                      </button>
                    )}
                    <button
                      onClick={() => setEditNote(false)}
                      style={{
                        padding: '9px 12px',
                        background: 'transparent',
                        borderRadius: 8,
                        border: `1px solid ${C.border}`,
                        color: C.creamFaint,
                        fontSize: 12,
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              {!editNote && hasNote(selected.id) && (
                <div
                  onClick={() => openNote(selected.id)}
                  style={{
                    padding: '0 14px 12px',
                    borderLeft: `2px solid ${C.gold}`,
                    fontSize: 13,
                    color: C.gold,
                    lineHeight: 1.75,
                    cursor: 'pointer',
                    whiteSpace: 'pre-wrap',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {notes[selected.id]}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              {objections
                .filter((o) => o.id !== selected.id)
                .slice(0, 2)
                .map((o) => (
                  <div
                    key={o.id}
                    className='hov'
                    onClick={() =>
                      tf(() => {
                        setSelected(o);
                        setExpanded('response');
                        setEditNote(false);
                      })
                    }
                    style={{
                      flex: 1,
                      background: C.surface,
                      border: `1px solid ${C.border}`,
                      borderRadius: 10,
                      padding: '10px 12px',
                    }}
                  >
                    <div style={{ fontSize: 11, marginBottom: 3 }}>
                      {o.icon}{' '}
                      <span
                        style={{
                          fontSize: 9,
                          color: catColor[o.category] || C.creamFaint,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                        }}
                      >
                        {o.category}
                      </span>
                    </div>
                    <div
                      style={{
                        color: C.creamFaint,
                        fontSize: 11,
                        lineHeight: 1.4,
                      }}
                    >
                      "{o.objection.slice(0, 52)}…"
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ── LIVE ── */}
        {mode === 'realtime' && (
          <div>
            <div
              style={{
                background: '#0a1a12',
                border: `1px solid #1a3322`,
                borderRadius: 10,
                padding: '11px 16px',
                marginBottom: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 9,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: C.green,
                  boxShadow: `0 0 6px ${C.green}`,
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  color: C.green,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                }}
              >
                LIVE MODE
              </span>
              <span style={{ fontSize: 11, color: C.creamFaint }}>
                Tap the objection you're hearing right now
              </span>
            </div>
            <input
              value={rtSearch}
              onChange={(e) => setRtSearch(e.target.value)}
              placeholder='Quick filter…'
              style={{
                width: '100%',
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: '10px 14px',
                color: C.cream,
                fontSize: 13,
                marginBottom: 10,
              }}
            />
            <div style={{ marginBottom: 12 }}>
              <button
                onClick={() => setShowFavsOnly(!showFavsOnly)}
                style={{
                  padding: '5px 13px',
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  border: `1px solid ${showFavsOnly ? C.gold : C.border}`,
                  background: showFavsOnly ? C.gold + '18' : 'transparent',
                  color: showFavsOnly ? C.gold : C.creamFaint,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                ★ Favorites only {favs.length > 0 && `(${favs.length})`}
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {rtFiltered.map((o) => (
                <div
                  key={o.id}
                  className='hov'
                  onClick={() =>
                    tf(() => setSelected(selected?.id === o.id ? null : o))
                  }
                  style={{
                    background: selected?.id === o.id ? '#0d1520' : C.surface,
                    border: `1px solid ${selected?.id === o.id ? C.blue + '60' : C.border}`,
                    borderRadius: 11,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      padding: '12px 15px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <span style={{ fontSize: 17 }}>{o.icon}</span>
                    <span
                      style={{
                        flex: 1,
                        fontSize: 13,
                        color: selected?.id === o.id ? C.cream : C.creamDim,
                      }}
                    >
                      {o.objection}
                    </span>
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                      {hasNote(o.id) && (
                        <span
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: '50%',
                            background: C.gold,
                          }}
                        />
                      )}
                      <button
                        onClick={(e) => toggleFav(o.id, e)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '2px 4px',
                          fontSize: 14,
                          color: isFav(o.id) ? C.gold : C.creamFaint,
                          transition: 'all 0.15s',
                          lineHeight: 1,
                          textShadow: isFav(o.id)
                            ? `0 0 6px ${C.gold}`
                            : 'none',
                        }}
                      >
                        {isFav(o.id) ? '★' : '☆'}
                      </button>
                      <span
                        style={{
                          fontSize: 9,
                          color: catColor[o.category] || C.creamFaint,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                        }}
                      >
                        {o.category}
                      </span>
                    </div>
                  </div>
                  {selected?.id === o.id && (
                    <div
                      style={{
                        padding: '0 15px 15px',
                        borderTop: `1px solid ${C.border}`,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 9,
                          color: C.blue,
                          fontWeight: 700,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          margin: '12px 0 6px',
                        }}
                      >
                        SAY THIS
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: '#c5d8f5',
                          lineHeight: 1.8,
                          background: '#0a1020',
                          borderRadius: 9,
                          padding: '12px 14px',
                          borderLeft: `2px solid ${C.blue}`,
                        }}
                      >
                        {o.response}
                      </div>
                      {hasNote(o.id) && (
                        <>
                          <div
                            style={{
                              fontSize: 9,
                              color: C.gold,
                              fontWeight: 700,
                              letterSpacing: '0.1em',
                              textTransform: 'uppercase',
                              margin: '12px 0 6px',
                            }}
                          >
                            YOUR NOTE
                          </div>
                          <div
                            style={{
                              fontSize: 13,
                              color: C.gold,
                              lineHeight: 1.75,
                              background: '#120f05',
                              borderRadius: 9,
                              padding: '11px 14px',
                              borderLeft: `2px solid ${C.gold}`,
                              whiteSpace: 'pre-wrap',
                            }}
                          >
                            {notes[o.id]}
                          </div>
                        </>
                      )}
                      <div
                        style={{
                          fontSize: 9,
                          color: C.green,
                          fontWeight: 700,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          margin: '12px 0 6px',
                        }}
                      >
                        IF THEY PUSH BACK
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: '#a8d5c0',
                          lineHeight: 1.75,
                          background: '#081510',
                          borderRadius: 9,
                          padding: '11px 14px',
                          borderLeft: `2px solid ${C.green}`,
                        }}
                      >
                        {o.followup}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── QUIZ ── */}
        {mode === 'quiz' && (
          <div>
            <div
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 14,
                padding: '28px 22px',
                textAlign: 'center',
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: C.creamFaint,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  marginBottom: 14,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {quizIdx + 1} / {objections.length}
              </div>
              <div style={{ fontSize: 28, marginBottom: 14 }}>
                {objections[quizIdx].icon}
              </div>
              <span
                style={{
                  fontSize: 9,
                  color: catColor[objections[quizIdx].category] || C.creamDim,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: 14,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {objections[quizIdx].category}
              </span>
              <div
                className={`fade ${fade ? '' : 'out'}`}
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  color: C.cream,
                  lineHeight: 1.5,
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                "{objections[quizIdx].objection}"
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: C.creamFaint,
                  marginTop: 12,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                How would you handle this?
              </div>
            </div>
            {!quizRevealed ? (
              <button
                onClick={() => setQuizRevealed(true)}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: C.cream,
                  borderRadius: 11,
                  border: 'none',
                  color: C.bg,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: '0.03em',
                }}
              >
                Reveal Response
              </button>
            ) : (
              <div className={`fade ${fade ? '' : 'out'}`}>
                {[
                  {
                    label: 'Psychology',
                    content: objections[quizIdx].psychology,
                    accent: C.purple,
                  },
                  {
                    label: 'Response',
                    content: objections[quizIdx].response,
                    accent: C.blue,
                  },
                  {
                    label: 'Push Back',
                    content: objections[quizIdx].followup,
                    accent: C.green,
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    style={{
                      borderRadius: 11,
                      padding: '14px 16px',
                      marginBottom: 9,
                      borderLeft: `2px solid ${s.accent}`,
                      background: C.surface,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 9,
                        color: s.accent,
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        marginBottom: 7,
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {s.label}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: C.creamDim,
                        lineHeight: 1.8,
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {s.content}
                    </div>
                  </div>
                ))}
                {hasNote(objections[quizIdx].id) && (
                  <div
                    style={{
                      borderRadius: 11,
                      padding: '14px 16px',
                      marginBottom: 9,
                      borderLeft: `2px solid ${C.gold}`,
                      background: C.surface,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 9,
                        color: C.gold,
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        marginBottom: 7,
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      YOUR NOTE
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: C.gold,
                        lineHeight: 1.8,
                        whiteSpace: 'pre-wrap',
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {notes[objections[quizIdx].id]}
                    </div>
                  </div>
                )}
                <button
                  onClick={() =>
                    tf(() => {
                      setQuizIdx((quizIdx + 1) % objections.length);
                      setQuizRevealed(false);
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: 'transparent',
                    borderRadius: 11,
                    border: `1px solid ${C.border}`,
                    color: C.creamDim,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                    marginTop: 5,
                  }}
                >
                  Next Objection →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── AI COACH ── */}
        {mode === 'ai' && (
          <div>
            <div
              style={{
                background: `linear-gradient(135deg, #0a0f1e, #0f0a1e)`,
                border: `1px solid ${C.borderAccent}`,
                borderRadius: 14,
                padding: '22px 20px',
                marginBottom: 20,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: -30,
                  right: -20,
                  width: 140,
                  height: 140,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${C.blue}18, transparent 70%)`,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: -40,
                  left: -10,
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${C.purple}14, transparent 70%)`,
                }}
              />
              <div style={{ fontSize: 24, marginBottom: 10 }}>✦</div>
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: C.cream,
                  marginBottom: 6,
                }}
              >
                AI Coach
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: C.creamFaint,
                  lineHeight: 1.7,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Heard something that's not in the library? Type it below and get
                an expert response with the psychology behind it — instantly.
              </div>
            </div>

            <div
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: '16px',
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: C.blue,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: 10,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Type the objection you just heard
              </div>
              <textarea
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) askAI();
                }}
                placeholder={`e.g. "My accountant told me to stay away from whole life"\ne.g. "I'm going through a divorce right now"\ne.g. "My neighbor's claim took two years"`}
                style={{
                  width: '100%',
                  minHeight: 85,
                  background: C.bg,
                  border: `1px solid ${C.border}`,
                  borderRadius: 9,
                  padding: '10px 13px',
                  color: C.cream,
                  fontSize: 13,
                  lineHeight: 1.7,
                  resize: 'vertical',
                }}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 10,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    color: C.creamFaint,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  ⌘ + Enter to submit
                </span>
                <button
                  onClick={askAI}
                  disabled={!aiInput.trim() || aiLoading}
                  style={{
                    padding: '9px 18px',
                    borderRadius: 9,
                    border: 'none',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor:
                      aiInput.trim() && !aiLoading ? 'pointer' : 'default',
                    background:
                      aiInput.trim() && !aiLoading
                        ? `linear-gradient(135deg, ${C.blue}, ${C.purple})`
                        : C.border,
                    color: aiInput.trim() && !aiLoading ? '#fff' : C.creamFaint,
                    fontFamily: "'DM Sans', sans-serif",
                    transition: 'all 0.2s',
                    boxShadow:
                      aiInput.trim() && !aiLoading
                        ? `0 0 12px ${C.blue}30`
                        : 'none',
                  }}
                >
                  {aiLoading ? 'Thinking…' : 'Get Response ✦'}
                </button>
              </div>
            </div>

            {aiLoading && (
              <div
                style={{
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: 12,
                  padding: '28px 20px',
                  textAlign: 'center',
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 5,
                    marginBottom: 12,
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className='pulse'
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        background: C.blue,
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  ))}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: C.blue,
                    fontWeight: 600,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Crafting your response…
                </div>
              </div>
            )}

            {aiError && (
              <div
                style={{
                  background: '#1a0808',
                  border: '1px solid #3a1515',
                  borderRadius: 10,
                  padding: '12px 16px',
                  marginBottom: 14,
                  fontSize: 12,
                  color: '#f87171',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {aiError}
              </div>
            )}

            {aiResult && !aiLoading && (
              <div style={{ marginBottom: 20 }}>
                <div
                  style={{
                    fontSize: 9,
                    color: C.green,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: 10,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  ✓ Response Ready
                </div>
                <AICard entry={aiResult} />
              </div>
            )}

            {aiHistory.length > 1 && (
              <div>
                <div
                  style={{
                    fontSize: 9,
                    color: C.creamFaint,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: 12,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Previous ({aiHistory.length - 1})
                </div>
                {aiHistory.slice(1).map((e, i) => (
                  <AICard key={i} entry={e} />
                ))}
              </div>
            )}

            {aiHistory.length === 0 && !aiLoading && !aiResult && (
              <div style={{ textAlign: 'center', padding: '30px 20px' }}>
                <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.3 }}>
                  ✦
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: C.creamFaint,
                    lineHeight: 1.8,
                    fontFamily: "'DM Sans', sans-serif",
                    marginBottom: 18,
                  }}
                >
                  No AI responses yet.
                  <br />
                  Type an objection above to get started.
                </div>
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: 7 }}
                >
                  {[
                    'My accountant told me to stay away from whole life',
                    "I'm going through a divorce right now",
                    "My neighbor's claim took two years to pay out",
                  ].map((ex) => (
                    <button
                      key={ex}
                      onClick={() => setAiInput(ex)}
                      style={{
                        background: C.surface,
                        border: `1px solid ${C.border}`,
                        borderRadius: 9,
                        padding: '10px 14px',
                        color: C.creamFaint,
                        fontSize: 11,
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontFamily: "'DM Sans', sans-serif",
                        transition: 'all 0.15s',
                      }}
                    >
                      "{ex}"
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>
    </div>
  );
}
