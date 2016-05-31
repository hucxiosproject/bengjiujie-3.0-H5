import ReactDOM from 'react-dom';
import routes from './routes';
import cookie from "react-cookie";

function getQueryParams(qs) {
  qs = qs.split("+").join(" ");

  var params = {}, tokens,
    re = /[?&]?([^=]+)=([^&]*)/g;

  while (tokens = re.exec(qs)) {
    params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
  }

  return params;
};

~(function() {
  var search = window.location.search;
  var params ={};
  if (search) {
    params = getQueryParams(search);
    if (params.token) {
      cookie.save('token', params.token);
      window.token = params.token;
    }
  }
})();

ReactDOM.render(routes, document.getElementById('app'));
