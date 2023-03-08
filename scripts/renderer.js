class Renderer {
    // canvas:              object ({id: __, width: __, height: __})
    // limit_fps_flag:      bool 
    // fps:                 int
    constructor(canvas, limit_fps_flag, fps) {
        this.canvas = document.getElementById(canvas.id);
        this.canvas.width = canvas.width;
        this.canvas.height = canvas.height;
        this.ctx = this.canvas.getContext('2d');
        this.slide_idx = 0;
        this.limit_fps = limit_fps_flag;
        this.fps = fps;
        this.start_time = null;
        this.prev_time = null;

        this.ball_tx = null;
        this.ball_ty = null;

        this.ball_v_x = 350;
        this.ball_v_y = 350;

        this.ball_center = {x: 200, y: 200};
        this.ball_radius = 40;



        this.rotationTransform0 = new Matrix(3,3);
        
        this.poly0_vel_r = .3;
        this.poly1_vel_r = 7;
        this.poly2_vel_r = -5;

        this.poly0_r = 0;
        this.poly1_r = Math.PI/4;
        this.poly2_r = Math.PI/6;



        this.poly1_s = 2;

        this.poly1_s_m_x = 1.1;
        this.poly1_s_m_y = -2;

        this.poly1_s_v = 2;
        


        this.poly2_s = 1;
        
        this.poly2_s_m_x = 1.5;
        this.poly2_s_m_y = 1.5;
        
        this.poly2_s_v = 8;
    }


    // flag:  bool
    limitFps(flag) {
        this.limit_fps = flag;
    }

    // n:  int
    setFps(n) {
        this.fps = n;
    }

    // idx: int
    setSlideIndex(idx) {
        this.slide_idx = idx;
    }

    animate(timestamp) {
        // Get time and delta time for animation
        if (this.start_time === null) {
            this.start_time = timestamp;
            this.prev_time = timestamp;
        }
        let time = timestamp - this.start_time;
        let delta_time = timestamp - this.prev_time;
        //console.log('animate(): t = ' + time.toFixed(1) + ', dt = ' + delta_time.toFixed(1));

        // Update transforms for animation
        this.updateTransforms(time, delta_time);

        // Draw slide
        this.drawSlide();

        // Invoke call for next frame in animation
        if (this.limit_fps) {
            setTimeout(() => {
                window.requestAnimationFrame((ts) => {
                    this.animate(ts);
                });
            }, Math.floor(1000.0 / this.fps));
        }
        else {
            window.requestAnimationFrame((ts) => {
                this.animate(ts);
            });
        }

        // Update previous time to current one for next calculation of delta time
        this.prev_time = timestamp;
    }

    //
    updateTransforms(time, delta_time) {
        // TODO: update any transformations needed for animation
        
        this.ball_tx = this.ball_tx + this.ball_v_x *((delta_time)/1000.0);
        this.ball_ty = this.ball_ty + this.ball_v_y *((delta_time)/1000.0);


        this.poly0_r = (this.poly0_r + this.poly0_vel_r*(delta_time/1000)) % (2*Math.PI);
        this.poly1_r = (this.poly1_r + this.poly1_vel_r*(delta_time/1000)) % (2*Math.PI);
        this.poly2_r = (this.poly2_r + this.poly2_vel_r*(delta_time/1000)) % (2*Math.PI);
        

        this.poly1_s_x = (this.poly1_s_m_x + (Math.cos(this.poly1_s_v *time/1000)));
        this.poly1_s_y = (this.poly1_s_m_y + (Math.cos(this.poly1_s_v *time/1000)));

        this.poly2_s_x = (this.poly2_s_m_x + (Math.cos(this.poly2_s_v *time/1000)));
        this.poly2_s_y = (this.poly2_s_m_y + (Math.cos(this.poly2_s_v *time/1000)));
       
        
    }
    
    //
    drawSlide() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        switch (this.slide_idx) {
            case 0:
                this.drawSlide0();
                break;
            case 1:
                this.drawSlide1();
                break;
            case 2:
                this.drawSlide2();
                break;
            case 3:
                this.drawSlide3();
                break;
        }
    }

    //
    drawSlide0() {
        // TODO: draw bouncing ball (circle that changes direction whenever it hits an edge)


        let ball_points = [
            Vector3(this.ball_center.x + this.ball_radius * Math.cos(0), this.ball_center.y + this.ball_radius * Math.sin(0), 1),
            Vector3(this.ball_center.x + this.ball_radius * Math.cos(Math.PI / 12), this.ball_center.y + this.ball_radius * Math.sin(Math.PI / 12), 1),
            Vector3(this.ball_center.x + this.ball_radius * Math.cos(Math.PI / 6), this.ball_center.y + this.ball_radius * Math.sin(Math.PI / 6), 1),
            Vector3(this.ball_center.x + this.ball_radius * Math.cos(Math.PI / 4), this.ball_center.y + this.ball_radius * Math.sin(Math.PI / 4), 1),
            Vector3(this.ball_center.x + this.ball_radius * Math.cos(Math.PI / 3), this.ball_center.y + this.ball_radius * Math.sin(Math.PI / 3), 1),
            Vector3(this.ball_center.x + this.ball_radius * Math.cos(5 * Math.PI / 12), this.ball_center.y + this.ball_radius * Math.sin(5 * Math.PI / 12), 1),

            Vector3(this.ball_center.x + this.ball_radius * Math.cos(Math.PI / 2), this.ball_center.y + this.ball_radius * Math.sin(Math.PI / 2), 1),
            Vector3(this.ball_center.x + this.ball_radius * Math.cos(7 * Math.PI / 12), this.ball_center.y + this.ball_radius * Math.sin(7 * Math.PI / 12), 1),
            Vector3(this.ball_center.x + this.ball_radius * Math.cos(2 * Math.PI / 3), this.ball_center.y + this.ball_radius * Math.sin(2 * Math.PI / 3), 1),
            Vector3(this.ball_center.x + this.ball_radius * Math.cos(3 * Math.PI / 4), this.ball_center.y + this.ball_radius * Math.sin(3 * Math.PI / 4), 1),
            Vector3(this.ball_center.x + this.ball_radius * Math.cos(5 * Math.PI / 6), this.ball_center.y + this.ball_radius * Math.sin(5 * Math.PI / 6), 1),
            Vector3(this.ball_center.x + this.ball_radius * Math.cos(11 * Math.PI / 12), this.ball_center.y + this.ball_radius * Math.sin(11 * Math.PI / 12), 1),

            Vector3(this.ball_center.x + this.ball_radius * Math.cos(Math.PI), this.ball_center.y + this.ball_radius * Math.sin(Math.PI), 1),
            Vector3(this.ball_center.x + this.ball_radius * Math.cos(13 * Math.PI / 12), this.ball_center.y + this.ball_radius * Math.sin(13 * Math.PI / 12), 1),
            Vector3(this.ball_center.x + this.ball_radius * Math.cos(7 * Math.PI / 6), this.ball_center.y + this.ball_radius * Math.sin(7 * Math.PI / 6), 1),
            Vector3(this.ball_center.x + this.ball_radius * Math.cos(5 * Math.PI / 4), this.ball_center.y + this.ball_radius * Math.sin(5 * Math.PI / 4), 1),
            Vector3(this.ball_center.x + this.ball_radius * Math.cos(4 * Math.PI / 3), this.ball_center.y + this.ball_radius * Math.sin(4 * Math.PI / 3), 1),
            Vector3(this.ball_center.x + this.ball_radius * Math.cos(17 * Math.PI / 12), this.ball_center.y + this.ball_radius * Math.sin(17 * Math.PI / 12), 1),

            Vector3(this.ball_center.x + this.ball_radius * Math.cos(3 * Math.PI / 2), this.ball_center.y + this.ball_radius * Math.sin(3 * Math.PI / 2), 1),
            Vector3(this.ball_center.x + this.ball_radius * Math.cos(19 * Math.PI / 12), this.ball_center.y + this.ball_radius * Math.sin(19 * Math.PI / 12), 1),
            Vector3(this.ball_center.x + this.ball_radius * Math.cos(5 * Math.PI / 3), this.ball_center.y + this.ball_radius * Math.sin(5 * Math.PI / 3), 1),
            Vector3(this.ball_center.x + this.ball_radius * Math.cos(7 * Math.PI / 4), this.ball_center.y + this.ball_radius * Math.sin(7 * Math.PI / 4), 1),
            Vector3(this.ball_center.x + this.ball_radius * Math.cos(11 * Math.PI / 6), this.ball_center.y + this.ball_radius * Math.sin(11 * Math.PI / 6), 1),
            Vector3(this.ball_center.x + this.ball_radius * Math.cos(23 * Math.PI / 12), this.ball_center.y + this.ball_radius * Math.sin(23 * Math.PI / 12), 1),
        ];



        let ball_t = new Matrix(3,3);
        mat3x3Translate(ball_t, this.ball_tx,this.ball_ty);

        let ball_pts = [];

        for(let i = 0; i < ball_points.length; i++){
            ball_pts.push(Matrix.multiply([ball_t, ball_points[i]]))
        }


            if(ball_pts[0].values[0][0] >= this.canvas.width) {
                this.ball_v_x = -Math.abs(this.ball_v_x);
            }
            if(ball_pts[18].values[1][0] <= 0) {
                this.ball_v_y = Math.abs(this.ball_v_y);
            }
            if(ball_pts[6].values[1][0] >= this.canvas.height) {
                this.ball_v_y = -Math.abs(this.ball_v_y);
            }
            if(ball_pts[12].values[0][0] <= 0) {
                this.ball_v_x = Math.abs(this.ball_v_x);
            }

        this.drawConvexPolygon(ball_pts, [123, 66, 245, 255]);
        
    }

    //
    drawSlide1() {
        let teal = [0, 128, 128, 255];
        let gold = [218,165,32, 255];
        let red = [158, 0, 0 , 255];
        let originTranslate = new Matrix(3,3);
        let returnTranslate = new Matrix(3,3);


        let poly0_points = [
            {x: 300, y: 300},
            {x: 300, y: 350},
            {x: 250, y: 300}
        ]

        let poly1_points = [
            {x: 450, y: 450},
            {x: 500, y: 500},
            {x: 450, y: 550},
            {x: 425, y: 525},
            {x: 400, y: 474}
        ]
        let poly2_points = [
            {x: 150, y: 100},
            {x: 250, y: 150},
            {x: 200, y: 100},
            {x: 125, y: 50}
        ]


        let poly0_center = {x: 0, y: 0 };
        for (let i = 0; i < poly0_points.length; i++){
            poly0_center.x = poly0_center.x + poly0_points[i].x;
            poly0_center.y = poly0_center.y + poly0_points[i].y;
        }
        poly0_center.x = parseInt(poly0_center.x/poly0_points.length);
        poly0_center.y = parseInt(poly0_center.y/poly0_points.length);
         
        mat3x3Translate(originTranslate, -poly0_center.x, -poly0_center.y);
        mat3x3Translate(returnTranslate, poly0_center.x, poly0_center.y);
        mat3x3Rotate(this.rotationTransform0, this.poly0_r);

        let A0 = Matrix.multiply([this.rotationTransform0, originTranslate]);
        A0 = Matrix.multiply([returnTranslate, A0]);
        let poly0 = [
            Matrix.multiply([A0, Vector3(poly0_points[0].x, poly0_points[0].y, 1)]),
            Matrix.multiply([A0, Vector3(poly0_points[1].x, poly0_points[1].y, 1)]),
            Matrix.multiply([A0, Vector3(poly0_points[2].x, poly0_points[2].y, 1)])
        ];



        let poly1_center = {x: 0, y: 0 };
        for (let i = 0; i < poly1_points.length; i++){
            poly1_center.x = poly1_center.x + poly1_points[i].x;
            poly1_center.y = poly1_center.y + poly1_points[i].y;
        }
        poly1_center.x = parseInt(poly1_center.x/poly1_points.length);
        poly1_center.y = parseInt(poly1_center.y/poly1_points.length);
        mat3x3Translate(originTranslate, -poly1_center.x, -poly1_center.y);
        mat3x3Translate(returnTranslate, poly1_center.x, poly1_center.y);
        mat3x3Rotate(this.rotationTransform0, this.poly1_r);

        let A1 = Matrix.multiply([this.rotationTransform0, originTranslate]);
        A1 = Matrix.multiply([returnTranslate, A1]);
        let poly1 = [
            Matrix.multiply([A1, Vector3(poly1_points[0].x, poly1_points[0].y, 1)]),
            Matrix.multiply([A1, Vector3(poly1_points[1].x, poly1_points[1].y, 1)]),
            Matrix.multiply([A1, Vector3(poly1_points[2].x, poly1_points[2].y, 1)]),
            Matrix.multiply([A1, Vector3(poly1_points[3].x, poly1_points[3].y, 1)]),
            Matrix.multiply([A1, Vector3(poly1_points[4].x, poly1_points[4].y, 1)])
        ];

        
        let poly2_center = {x: 0, y: 0 };
        for (let i = 0; i < poly2_points.length; i++){
            poly2_center.x = poly2_center.x + poly2_points[i].x;
            poly2_center.y = poly2_center.y + poly2_points[i].y;
        }
        poly2_center.x = parseInt(poly2_center.x/poly2_points.length);
        poly2_center.y = parseInt(poly2_center.y/poly2_points.length);
         
        mat3x3Translate(originTranslate, -poly2_center.x, -poly2_center.y);
        mat3x3Translate(returnTranslate, poly2_center.x, poly2_center.y);
        mat3x3Rotate(this.rotationTransform0, this.poly2_r);


        let A2 = Matrix.multiply([this.rotationTransform0, originTranslate]);
        A2= Matrix.multiply([returnTranslate, A2]);
        // let A = Matrix.multiply()
        let poly2 = [
            Matrix.multiply([A2, Vector3(poly2_points[0].x, poly2_points[0].y, 1)]),
            Matrix.multiply([A2, Vector3(poly2_points[1].x, poly2_points[1].y, 1)]),
            Matrix.multiply([A2, Vector3(poly2_points[2].x, poly2_points[2].y, 1)]),
            Matrix.multiply([A2, Vector3(poly2_points[3].x, poly2_points[3].y, 1)])
        ];
        this.drawConvexPolygon(poly0, teal)
        this.drawConvexPolygon(poly1, gold)
        this.drawConvexPolygon(poly2, red)   
    }

    //
    drawSlide2() {
        // TODO: draw at least 2 polygons grow and shrink about their own centers
        //   - have each polygon grow / shrink different sizes
        //   - try at least 1 polygon that grows / shrinks non-uniformly in the x and y directions
        

        let poly1_s_pts = [
            Vector3(300, 100, 1),
            Vector3(330, 200, 1), 
            Vector3(250, 250, 1),
            Vector3(170, 200, 1),
            Vector3(200, 100, 1)
        ]
        let poly1_s_center = Vector3(250, 175, 1);


        let poly2_s_pts = [
            Vector3(500, 400, 1),
            Vector3(550, 400, 1),
            Vector3(590, 440, 1),
            Vector3(590, 490, 1),
            Vector3(550, 530, 1),
            Vector3(500, 530, 1),
            Vector3(460, 490, 1),
            Vector3(460, 440, 1),
        ]   
        let poly2_s_center = Vector3(525, 465, 1);

        
        // translation matrix to origin
        let t_1 = new Matrix(3,3);
        mat3x3Translate(t_1, -1 * (poly1_s_center.values[0]), -1 * (poly1_s_center.values[1]));        
        // scale matrix
        let s = new Matrix(3,3);
        mat3x3Scale(s, this.poly1_s_x, this.poly1_s_y);
        // translation matrix back to center of polygon
        let t_2 = new Matrix(3,3);
        mat3x3Translate(t_2, poly1_s_center.values[0], poly1_s_center.values[1]);
        
        let t_poly1_s = Matrix.multiply([t_2, s]);
        t_poly1_s = Matrix.multiply([t_poly1_s, t_1]);
        
    
        let poly1 = [
            Matrix.multiply([t_poly1_s, poly1_s_pts[0]]),
            Matrix.multiply([t_poly1_s, poly1_s_pts[1]]),
            Matrix.multiply([t_poly1_s, poly1_s_pts[2]]),
            Matrix.multiply([t_poly1_s, poly1_s_pts[3]]),
            Matrix.multiply([t_poly1_s, poly1_s_pts[4]])
        ]


        // translation matrix to origin
        let t_1_ = new Matrix(3,3);
        mat3x3Translate(t_1_, -1 * (poly2_s_center.values[0]), -1 * (poly2_s_center.values[1]));        
        // scale matrix
        let s_ = new Matrix(3,3);
        mat3x3Scale(s_, this.poly2_s_x, this.poly2_s_y);
        // translation matrix back to center of polygon
        let t_2_ = new Matrix(3,3);
        mat3x3Translate(t_2_, poly2_s_center.values[0], poly2_s_center.values[1]);
        
        let t_poly2_s = Matrix.multiply([t_2_, s_]);
        t_poly2_s = Matrix.multiply([t_poly2_s, t_1_]);
        
    
        let poly2 = [
            Matrix.multiply([t_poly2_s, poly2_s_pts[0]]),
            Matrix.multiply([t_poly2_s, poly2_s_pts[1]]),
            Matrix.multiply([t_poly2_s, poly2_s_pts[2]]),
            Matrix.multiply([t_poly2_s, poly2_s_pts[3]]),
            Matrix.multiply([t_poly2_s, poly2_s_pts[4]]),
            Matrix.multiply([t_poly2_s, poly2_s_pts[5]]),
            Matrix.multiply([t_poly2_s, poly2_s_pts[6]]),
            Matrix.multiply([t_poly2_s, poly2_s_pts[7]]),
        ]

        this.drawConvexPolygon(poly1, [44, 99, 105, 255]);
        this.drawConvexPolygon(poly2, [61, 73, 133, 255]);
    }

    //
    drawSlide3() {
        // TODO: get creative!
        //   - animation should involve all three basic transformation types
        //     (translation, scaling, and rotation)
        
        
    }
    
    // vertex_list:  array of object [Matrix(3, 1), Matrix(3, 1), ..., Matrix(3, 1)]
    // color:        array of int [R, G, B, A]
    drawConvexPolygon(vertex_list, color) {
        this.ctx.fillStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + (color[3] / 255) + ')';
        this.ctx.beginPath();
        let x = vertex_list[0].values[0][0] / vertex_list[0].values[2][0];
        let y = vertex_list[0].values[1][0] / vertex_list[0].values[2][0];
        this.ctx.moveTo(x, y);
        for (let i = 1; i < vertex_list.length; i++) {
            x = vertex_list[i].values[0][0] / vertex_list[i].values[2][0];
            y = vertex_list[i].values[1][0] / vertex_list[i].values[2][0];
            this.ctx.lineTo(x, y);
        }
        this.ctx.closePath();
        this.ctx.fill();
    }
};