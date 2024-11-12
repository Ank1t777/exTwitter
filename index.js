import { tweetsData } from './data.js';
import { v4 as uuidv4 } from 'https://jspm.dev/uuid'; // v4 for unique id generation

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like); 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet);
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply);
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick();
    }
    else if (e.target.classList.contains('reply-button')) {
        const tweetId = e.target.dataset.tweetId;
        handleReplySubmit(tweetId);
    }
});

function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.find(tweet => tweet.uuid === tweetId);

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--;
    }
    else{
        targetTweetObj.likes++; 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked;
    render();
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.find(tweet => tweet.uuid === tweetId);
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--;
    }
    else{
        targetTweetObj.retweets++;
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
    render(); 
}

function handleReplyClick(replyId)
{
    const replyInput = document.getElementById(`reply-area-${replyId}`);
    const replyButton = document.getElementById(`reply-button-${replyId}`);

    replyInput.classList.toggle('hidden');
    replyButton.classList.toggle('hidden');
}

function handleReplySubmit(tweetId) {
    const replyInput = document.getElementById(`reply-area-${tweetId}`);
    const replyText = replyInput.value.trim();

    if (replyText !== '') {
        const targetTweet = tweetsData.find(tweet => tweet.uuid === tweetId);
        const newReply = {
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            tweetText: replyText,
            uuid: uuidv4()
        };
        targetTweet.replies.push(newReply);
        render();
        // Clear the reply input field
        replyInput.value = '';
    }
}

function handleTweetBtnClick()
{
    const tweetInput = document.getElementById('tweet-input');

    if(tweetInput.value)
    {
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
        render()
        tweetInput.value = ''
    }
}

function getFeedHtml(){
    let feedHtml = '';
    
    tweetsData.forEach(function(tweet){
        let likeIconClass = tweet.isLiked ? 'liked' : '';
        let retweetIconClass = tweet.isRetweeted ? 'retweeted' : '';
        let repliesHtml = '';
        
        // Check if the tweet has replies
        let hasReplies = tweet.replies.length > 0;

        // Create reply field HTML
        let replyFieldHtml = `
            <div class="replies">
                <div class="inner-reply">
                    <img src="images/scrimbalogo.png" class="profile-pic">
                    <input id="reply-area-${tweet.uuid}" type="text" placeholder="reply" class="hidden">
                    <button id="reply-button-${tweet.uuid}" class="reply-button hidden" data-tweet-id="${tweet.uuid}" onclick="handleReplySubmit('${tweet.uuid}')">reply</button>
                </div>
            </div>`;

        // If the tweet has replies, show the reply field initially
        if (hasReplies) {
            replyFieldHtml = `<div class="replies">${replyFieldHtml}</div>`;
        }

        // Add replies HTML
        if (hasReplies) {
            tweet.replies.forEach(function(reply) {
                repliesHtml += `
                <div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="${reply.profilePic}" class="profile-pic">
                        <div>
                            <p class="handle">${reply.handle}</p>
                            <p class="tweet-text">${reply.tweetText}</p>
                        </div>
                    </div>
                </div>`;
            });
        }

        // Concatenate all HTML
        feedHtml += `
            <div class="tweet">
                <div class="tweet-inner">
                    <img src="${tweet.profilePic}" class="profile-pic">
                    <div>
                        <p class="handle">${tweet.handle}</p>
                        <p class="tweet-text">${tweet.tweetText}</p>
                        <div class="tweet-details">
                            <span class="tweet-detail">
                                <i class="fa-regular fa-comment-dots" data-reply="${tweet.uuid}"></i>
                                ${tweet.replies.length}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-heart ${likeIconClass}" data-like="${tweet.uuid}"></i>
                                ${tweet.likes}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-retweet ${retweetIconClass}" data-retweet="${tweet.uuid}"></i>
                                ${tweet.retweets}
                            </span>
                        </div>   
                    </div>            
                </div>
                ${replyFieldHtml}
                <div id="replies-${tweet.uuid}">
                    ${repliesHtml}
                </div>
            </div>`;
   });

   return feedHtml;
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml();
}

render();
