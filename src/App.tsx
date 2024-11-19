//import { useState } from "react";
//import reactLogo from "./assets/react.svg";
//import upstreamLogo from ".undraw_icon_design_re_9web.svg";
import "./App.css";

let urlMain = window.location.href.split("/");
//console.log(urlMain);
let urlSec = urlMain[3].split("=");
//console.log(urlSec);
let accessTokenPre = urlSec[1];
let accessTokenPreSec = accessTokenPre.split("&");
let accessToken = accessTokenPreSec[0];
//console.log(accessToken);

//let musicData: object;
let userId: string;
let uris: string[] = [];
let playlistId: string;

let bgInterval = setInterval(() => {
  let navBr = document.getElementById("nav") as HTMLElement;
  // type RGB = [number, number, number];

  navBr.style.backgroundColor = `rgb(${Math.floor(
    Math.random() * 255
  )}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
}, 1000);

bgInterval;

// let bulb = document.getElementById("bulbDiv") as HTMLElement;
// let bodContainer = document.getElementById("body") as HTMLElement;
// bulb.addEventListener("click", function () {
//   if (bodContainer.style.backgroundColor != "white") {
//     bodContainer.style.backgroundColor = "white";
//   } else {
//     bodContainer.style.backgroundColor = "black";
//   }
// });

async function getMe(accessToken: string) {
  const response = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });

  const myData = await response.json();
  //console.log(myData);

  userId = myData.id;
  console.log(userId);
  getUserPlaylists(userId);
  let dispName = myData.display_name;
  //console.log(dispName);
  let usrObj = document.getElementById("username") as HTMLElement;
  usrObj.innerText = dispName;
}

async function getUserPlaylists(userId: string) {
  const response = await fetch(
    `https://api.spotify.com/v1/users/${userId}/playlists`,
    {
      // method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
      // body: JSON.stringify(details),
    }
  );

  const playlistData = await response.json();
  console.log(playlistData);

  for (let i = 0; i < playlistData.items.length; i++) {
    if (playlistData.items[i].images !== "null") {
      // console.log(playlistData.items[i].images[1]);
      let playlistImg = document.createElement("img");
      if (playlistData.items[i].images[0] != "undefined") {
        playlistImg.setAttribute("src", playlistData.items[i].images[0].url);
        playlistImg.style.padding = "1rem";
        playlistImg.style.width = "300px";
        playlistImg.style.height = "300px";
        document.getElementById("container")?.appendChild(playlistImg);
        //console.log(playlistData.items[i].images[1].url);
      } else {
        playlistImg.setAttribute("src", playlistData.items[i].images[1].url);
        playlistImg.style.padding = "1rem";
        document.getElementById("container")?.appendChild(playlistImg);
      }
    }
  }
}

async function createPlaylist(userId: string) {
  let details = {
    name: "Midnight Classics With DJ M - Ep. ?",
    description: "Curated With VAULT.",
  };
  const response = await fetch(
    `https://api.spotify.com/v1/users/${userId}/playlists`,
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify(details),
    }
  );

  const playlistData = await response.json();
  console.log(playlistData);
  playlistId = playlistData.id;
}

function scroll() {
  let recentDiv = document.getElementById("recent") as HTMLElement;
  recentDiv.scrollTop += 100;
}

async function getMusic(accessToken: string) {
  const response = await fetch(
    "https://api.spotify.com/v1/me/player/recently-played?limit=50",
    {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }
  );

  const musicData = await response.json();
  console.log(musicData);

  let recentDiv = document.getElementById("recent") as HTMLElement;

  for (let i = 0; i < musicData.items.length; i++) {
    uris[i] = musicData.items[i].track.uri;
    // uris.push(musicData.items[i].uri);
    // console.log(musicData.items[i].track.name);
    let trackDiv = document.createElement("div") as HTMLElement;
    let imgDiv = document.createElement("img") as HTMLElement;
    let titleDiv = document.createElement("p") as HTMLElement;
    imgDiv.setAttribute("src", musicData.items[i].track.album.images[2].url);
    titleDiv.innerText = musicData.items[i].track.name;
    trackDiv.appendChild(imgDiv);
    trackDiv.appendChild(titleDiv);
    //console.log(trackDiv);
    recentDiv.appendChild(trackDiv);
    trackDiv.style.display = "flex";
    trackDiv.style.flexDirection = "column";
    trackDiv.style.padding = "2em";

    recentDiv.style.display = "flex";
    recentDiv.style.flexWrap = "wrap";
    scroll();
    recentDiv.style.overflowY = "auto";
  }
  console.log(uris);

  let coverImg = musicData.items[0].track.album.images[2].url;

  const responseNew = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=` + uris,
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify(uris),
    }
  );

  const responseImg = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/images/
    ` + coverImg,
    {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
      //body: JSON.stringify(coverImg),
    }
  );

  const playlistDataTracks = await responseNew.json();
  const playlistDataImg = await responseImg.json();
  console.log(playlistDataTracks);
  console.log(playlistDataImg);
}

// async function addMusic(accessToken: string) {
//   const musicData = await response.json();
//   console.log(musicData);
// }

function App() {
  // const [count, setCount] = useState(0);

  getMe(accessToken);

  // addMusic(accessToken);

  //let plusDiv = document.getElementById("plusDiv") as HTMLElement;
  const displayRecent = () => {
    console.log("plus sign clicked!");
    let container = document.getElementById("container") as HTMLElement;
    // let recent = document.getElementById("recent") as HTMLElement;

    container.style.display = "none";

    // recent.appendChild(upstream);
    // let curateDiv = document.createElement("div");
    // let curateBtn = document.createElement("button");
    // curateBtn.innerText = "Curate";
    // curateDiv.appendChild(curateBtn);
    // curateDiv.style.alignContent = "center";
    // let body = document.getElementById("body") as HTMLElement;
    // recent.appendChild(curateDiv);
    // body.style.overflow = "auto";

    createPlaylist(userId);
    getMusic(accessToken);

    // if (container.style.display != "none") {
    //   container.style.display = "none";
    // } else {
    //   container.style.display = "flex";
    // }

    // if (recent.style.display != "flex") {
    //   recent.style.display = "flex";
    // } else {
    //   recent.style.display = "none";
    // }

    // else {
    //   container.style.display = "none";
    // }
  };

  return (
    <div>
      <div id="nav">
        <div style={{ paddingTop: "2em" }}>
          <svg
            fill="#000000"
            height="18px"
            width="18px"
            version="1.1"
            id="bulbDiv"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 512 512"
            xmlSpace="preserve"
          >
            <g>
              <g>
                <path
                  d="M256,0C155.174,0,73.143,82.027,73.143,182.857c0,67.839,38.46,130.937,98.424,162.232l1.817,25.482
                c0.357,5.036,4.719,8.911,9.772,8.464c5.036-0.357,8.826-4.732,8.469-9.768l-2.187-30.661c-0.232-3.259-2.192-6.152-5.134-7.571
                c-56.42-27.348-92.875-85.518-92.875-148.178c0-90.741,73.826-164.571,164.571-164.571c90.745,0,164.571,73.83,164.571,164.571
                c0,66.919-39.969,126.652-101.821,152.196c-3.201,1.322-5.379,4.339-5.629,7.795l-3.978,55.661
                c-0.357,5.036,3.433,9.411,8.469,9.768c0.223,0.018,0.442,0.027,0.661,0.027c4.755,0,8.768-3.679,9.112-8.491l3.58-50.116
                c65.732-29.527,107.893-94.402,107.893-166.839C438.857,82.027,356.826,0,256,0z"
                />
              </g>
            </g>
            <g>
              <g>
                <path
                  d="M312.915,420.804l-118.857-27.429c-4.906-1.134-9.83,1.937-10.969,6.857c-1.134,4.92,1.933,9.83,6.853,10.964
                l118.857,27.429c0.692,0.161,1.384,0.232,2.067,0.232c4.161,0,7.924-2.857,8.902-7.089
                C320.902,426.848,317.835,421.937,312.915,420.804z"
                />
              </g>
            </g>
            <g>
              <g>
                <path
                  d="M312.915,457.375l-118.857-27.429c-4.906-1.134-9.83,1.937-10.969,6.857c-1.134,4.92,1.933,9.83,6.853,10.964
                l118.857,27.429c0.692,0.161,1.384,0.232,2.067,0.232c4.161,0,7.924-2.857,8.902-7.089
                C320.902,463.42,317.835,458.509,312.915,457.375z"
                />
              </g>
            </g>
            <g>
              <g>
                <path
                  d="M312.915,493.947l-118.857-27.429c-4.906-1.143-9.83,1.928-10.969,6.857c-1.134,4.92,1.933,9.83,6.853,10.964
                l118.857,27.429c0.692,0.161,1.384,0.232,2.067,0.232c4.161,0,7.924-2.857,8.902-7.089
                C320.902,499.991,317.835,495.08,312.915,493.947z"
                />
              </g>
            </g>
          </svg>
        </div>
        <div id="vaultbtn">
          <h1>VAULT</h1>
        </div>

        <div id="srchArt">
          <input type="text" placeholder="Search For An Artist.." />
        </div>

        <div id="plusDiv" onClick={displayRecent}>
          <span>&#43;</span>
        </div>
      </div>
      <div id="body">
        <h2 id="username"></h2>
        <div id="container"></div>

        <div id="recent">
          {/* <div id="curate">
            <button id="curateBtn">Curate</button>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default App;
