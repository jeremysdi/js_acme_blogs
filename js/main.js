// Function 1
function createElemWithText(name = "p", textContent = "", className){
    const newElem = document.createElement(name);
    newElem.textContent = textContent;
    if (className) newElem.classList.add(className);
    return newElem;
}
//Function 2
function createSelectOptions(data){
    if (data){
        const userArray = [];
        data.forEach((user) => {
            const option = document.createElement("option");
            option.value = user.id;
            option.textContent = user.name;
            userArray.push(option);
        })
        return userArray;
    }
    else{
        return undefined;
    }
}
//Function 3
function toggleCommentSection(postId){
    if (postId){
        const matchingSection = document.querySelector('section[data-post-id=\'' + postId +'\']');
        if (matchingSection) {
        matchingSection.className = matchingSection.className === 'hide' ? '' : 'hide';
        return matchingSection;
        }
        else {
            return null;
        }
    }
    else{
        return undefined;
    }
}
//Function 4
function toggleCommentButton(postId){
    if (postId){
        const matchingButton = document.querySelector('button[data-post-id=\'' + postId +'\']');
        if (matchingButton) {
        matchingButton.textContent = matchingButton.textContent === 'Hide Comments' ? 'Show Comments' : 'Hide Comments';
        return matchingButton;
        }
        else {
            return null;
        }
    }
    else{
        return undefined;
    }
}
//Function 5
function deleteChildElements(parentElement){
    if (parentElement instanceof HTMLElement){
        var childElement = parentElement.lastElementChild;
        while (childElement) {
            parentElement.removeChild(childElement);
            childElement = parentElement.lastElementChild;
        }
        return parentElement;
    }
    else {
        return undefined;
    }
}
//Function 6
function addButtonListeners(){
    const main = document.querySelector("main");
    const buttons = main.querySelectorAll("button")
    if (buttons){
        buttons.forEach( (button) => {
            const postId = button.dataset.postId;
            button.addEventListener("click", function (e) {toggleComments(e, postId)}, false);
        })
    }
    return buttons;
}
//Function 7
function removeButtonListeners(){
    const main = document.querySelector("main");
    const buttons = main.querySelectorAll("button")
    if (buttons){
        buttons.forEach( (button) => {
            const postId = button.dataset.postId;
            button.removeEventListener("click", function (e) {toggleComments(e, postId)}, false);
        })
    }
    return buttons;
}
//Function 8
function createComments(comments){
    if (comments){
    const frag = document.createDocumentFragment();
    comments.forEach( (comment) => {
        const article = document.createElement("article");
        const header3 = createElemWithText("h3", comment.name);
        const pComment = createElemWithText('p', comment.body);
        const pEmail = createElemWithText('p', "From: " + comment.email);
        article.append(header3);
        article.append(pComment);
        article.append(pEmail);
        frag.append(article);
    })
    return frag;
    }
    else {
        return undefined;
    }
}
//Function 9
function populateSelectMenu(users){
    if (users){
        const theMenu = document.getElementById("selectMenu");
        const selectOptions = createSelectOptions(users);
        selectOptions.forEach( (option) => {
            theMenu.append(option);
        })
        return theMenu;
    }
    else{
        return undefined;
    }
}
//Function 10
const getUsers = async () => {
    
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const jsonUserData = await response.json();
    return jsonUserData;
}
//Function 11
const getUserPosts = async (userId) => {
    if (userId){
    const response = await fetch("https://jsonplaceholder.typicode.com/posts?userId=" + userId);
    const jsonUserData = await response.json();
    return jsonUserData;
    }
    else{
        return undefined;
    }
}
//Function 12
const getUser = async (userId) => {
    if (userId){
    const response = await fetch("https://jsonplaceholder.typicode.com/users?id=" + userId);
    const jsonUserData = await response.json();
    return jsonUserData[0];
    }
    else {
        return undefined;
    }
}
//Function 13
const getPostComments = async (postId) => {
    if (postId){
    const response = await fetch("https://jsonplaceholder.typicode.com/comments?postId=" + postId);
    const jsonUserData = await response.json();
    return jsonUserData;
    }
    else {
        return undefined;
    }
}
//Function 14
const displayComments = async (postId) => {
    if (postId){
    const mySection = document.createElement("section");
    mySection.dataset.postId = postId;
    mySection.classList.add("comments");
    mySection.classList.add("hide");
    var comments = await getPostComments(postId);
    var fragment = createComments(comments);
    mySection.append(fragment);
    return mySection;
    }
    else{
        return undefined;
    }
}
//Function 15
const createPosts = async (jsonPosts) => {
    if (jsonPosts){
        const fragment = document.createDocumentFragment();
        for (const post of jsonPosts) {
            const myArticle = document.createElement("article");
            const h2Title = createElemWithText('h2', post.title);
            const pBody = createElemWithText('p', post.body);
            const pPostId = createElemWithText('p', "Post ID: " + post.id);
            const author = await getUser(post.userId);
            const pAuthor = createElemWithText('p', "Author: " + author.name + " with " + author.company.name);
            const pCatchPhrase = createElemWithText('p', author.company.catchPhrase);
            const button = createElemWithText('button', "Show Comments");
            button.dataset.postId = post.id;
            myArticle.append(h2Title);
            myArticle.append(pBody);
            myArticle.append(pPostId);
            myArticle.append(pAuthor);
            myArticle.append(pCatchPhrase);
            myArticle.append(button);
            const section = await displayComments(post.id);
            myArticle.append(section);
            fragment.append(myArticle);
        }
        return fragment;
    }
    else {
        return undefined;
    }
}
//Function 16
const displayPosts = async (jsonPosts) => {
    const main = document.querySelector("main");
    var element;
    if (jsonPosts){
        element = await createPosts(jsonPosts);
        main.append(element);
        return element;
    }
    else{
        return main.firstElementChild;
    }
}
//Function 17
function toggleComments(e, postId){
    if (e && postId){
        e.target.listener = true;
        const resultSection = toggleCommentSection(postId);
        const resultButton = toggleCommentButton(postId);
        const commentArray = [resultSection, resultButton];
        return commentArray;
    }
    else{
        return undefined;
    }
}
//Function 18
const refreshPosts = async (jsonPosts) => {
    if (jsonPosts){
        const removedButtons = removeButtonListeners();
        const childlessMain = deleteChildElements(document.querySelector("main"));
        const fragment = await displayPosts(jsonPosts);
        const addButtons = addButtonListeners();
        return [removedButtons, childlessMain, fragment, addButtons];
    }
    else{
        return undefined;
    }
}
//Function 19
const selectMenuChangeEventHandler = async (e) => {
    if (e){
        const theMenu = document.getElementById("selectMenu");
        theMenu.disabled = true;
        const userId = e.target.value||1;
        const jsonPosts = await getUserPosts(userId);
        const refreshPostsArray = await refreshPosts(jsonPosts);
        theMenu.disabled = false;
        return [userId, jsonPosts, refreshPostsArray];
    }
    else{
        return undefined;
    }
}
//Function 20
const initPage = async () => {
    const jsonUsers = await getUsers();
    const selectElement = populateSelectMenu(jsonUsers);
    return [jsonUsers, selectElement];
}
//Function 21
function initApp() {
    initPage();
    const theMenu = document.getElementById("selectMenu");
    theMenu.addEventListener("change", selectMenuChangeEventHandler, false);
}