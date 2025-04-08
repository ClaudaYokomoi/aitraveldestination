document.getElementById('travel-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const userInput = document.getElementById('user-input').value;
    
    if (!userInput.trim()) return;
    
    // Show loading state
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('result').classList.add('hidden');
    
    try {
        const destination = await getAIDestination(userInput);
        displayDestination(destination);
    } catch (error) {
        console.error("Error:", error);
        displayError();
    } finally {
        document.getElementById('loading').classList.add('hidden');
    }
});

document.getElementById('reset-btn').addEventListener('click', function() {
    document.getElementById('travel-form').reset();
    document.getElementById('result').classList.add('hidden');
    document.getElementById('user-input').focus();
});

async function getAIDestination(prompt) {
    const apiKey = '6652ce39094fdo68f706cff3baab7t3f';
    const context = `You are a concise travel assistant. Recommend ONE specific destination based on these rules:
    - Respond in this exact format:
    [Location Name]
    [Country]
    [1-sentence description]
    [3 bullet-point highlights]
    [Best time to visit]
    [Image search suggestion: 3 keywords]
    
    Example:
    Santorini
    Greece
    A stunning volcanic island with whitewashed buildings and blue domes.
    • Famous sunset views in Oia
    • Unique black sand beaches
    • Ancient ruins at Akrotiri
    Best time: May-September
    Image search: santorini sunset, oia white buildings, caldera view`;

    const response = await fetch(
        `https://api.shecodes.io/ai/v1/generate?prompt=${encodeURIComponent(prompt)}&context=${encodeURIComponent(context)}&key=${apiKey}`
    );
    
    if (!response.ok) {
        throw new Error('API request failed');
    }
    
    const data = await response.json();
    return formatAIResponse(data.answer);
}

function formatAIResponse(text) {
    const parts = text.split('\n').filter(part => part.trim() !== '');
    
    // Fallback if format isn't followed
    if (parts.length < 6) {
        return {
            location: "Beautiful Destination",
            country: "",
            description: text,
            highlights: [],
            bestTime: "Year-round",
            imageKeywords: "scenic travel views"
        };
    }
    
    return {
        location: parts[0] || "Beautiful Destination",
        country: parts[1] || "",
        description: parts[2] || "A wonderful travel destination",
        highlights: parts.slice(3, 6).map(item => item.replace('• ', '').trim()),
        bestTime: parts[6]?.replace('Best time: ', '') || "Year-round",
        imageKeywords: parts[7]?.replace('Image search: ', '') || `${parts[0]} scenery`
    };
}

function displayDestination(destination) {
    const output = document.getElementById('destination-output');
    
    output.innerHTML = `
        <h3>${destination.location}${destination.country ? `, ${destination.country}` : ''}</h3>
        <p class="description">${destination.description}</p>
        
        <div class="highlights">
            <h4>Highlights:</h4>
            <ul>${destination.highlights.map(item => `<li>${item}</li>`).join('')}</ul>
        </div>
        
        <p class="best-time"><strong>Best time to visit:</strong> ${destination.bestTime}</p>
        <p class="image-search"><strong>Photo ideas:</strong> ${destination.imageKeywords}</p>
        
        <div class="disclaimer">
            <p><em>Note: AI-generated content. Verify details before travel planning.</em></p>
        </div>
    `;
    
    document.getElementById('result').classList.remove('hidden');
}

function displayError() {
    const output = document.getElementById('destination-output');
    output.innerHTML = `
        <div class="error">
            <h3>Oops! Something went wrong</h3>
            <p>We couldn't generate a destination recommendation at this time. Please try again later.</p>
        </div>
    `;
    document.getElementById('result').classList.remove('hidden');
}

document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', function() {
        const category = this.getAttribute('data-category');
        let prompt = '';
        
        switch(category) {
            case 'beach':
                prompt = 'best beach destinations with clear water and white sand';
                break;
            case 'mountain':
                prompt = 'most beautiful mountain destinations for hiking and views';
                break;
            case 'forest':
                prompt = 'top forest destinations with lush greenery and wildlife';
                break;
            case 'desert':
                prompt = 'amazing desert destinations with unique landscapes';
                break;
        }
        
        document.getElementById('user-input').value = prompt;
        document.getElementById('travel-form').dispatchEvent(new Event('submit'));
    });
});