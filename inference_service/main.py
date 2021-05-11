from flask import Flask, request, jsonify
import os
import json

app = Flask(__name__)

"""
Request:
{
    "request_id": 1,
    "filepath": "/foo/bar"
}

Response:
{
    "anomaly_score": int,
    "anomaly_inference": file_path,
    "Segmentation_file": file_path
}
"""


@app.route('/process/<uuid>', methods=['POST'])
def infer(uuid):
    """
    This function accepts a path to a zip file such as "Brats17_CBICA_ABH_1-20210506T211734Z-001.zip"
    which contains 4 scan types. The file size is usually ~10Mb
    """
    
    base_save_dir = "/tmp/"
    print(uuid)
    
    req_json = json.loads(request.data)
    
    print(req_json)
    return jsonify({'anomaly_score': 44, 'anomaly_image': '', 'segmentation_path': '/tmp/foo.nii.gz'})

if __name__ == '__main__':
    app.run(debug=True)